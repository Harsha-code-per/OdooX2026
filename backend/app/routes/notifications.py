from fastapi import APIRouter, Depends, HTTPException, status, Query, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, or_
from typing import List, Optional
from uuid import UUID
from datetime import datetime, timedelta

from app.database import get_db
from app.models.notification import Notification, NotificationPreference, NotificationType, NotificationPriority, NotificationStatus
from app.models.user import User
from app.schemas.notification import (
    NotificationCreate, NotificationUpdate, NotificationResponse,
    NotificationPreferenceCreate, NotificationPreferenceUpdate, NotificationPreferenceResponse,
    NotificationSummary, BatchNotificationCreate, NotificationMarkReadRequest, NotificationDeleteRequest
)
from app.dependencies.auth import get_current_user, get_current_admin_user
from app.utils.email import send_email

router = APIRouter(prefix="/notifications", tags=["Notifications"])

# Helper function to send notification
async def send_notification(db: AsyncSession, notification: Notification, preference: NotificationPreference) -> bool:
    """Send notification based on user preferences"""
    notification.sent_via_app = True
    notification.app_sent_at = datetime.utcnow()
    notification.status = NotificationStatus.sent

    # Email notification logic would go here
    if preference.enable_email_notifications:
        try:
            # await send_email(notification.user.email, notification.title, notification.message)
            notification.sent_via_email = True
            notification.email_sent_at = datetime.utcnow()
        except Exception as e:
            notification.error_message = str(e)
            notification.retry_count += 1
            if notification.retry_count >= 3:
                notification.status = NotificationStatus.failed

    return True

# Helper function to check quiet hours
def is_quiet_hours(preference: NotificationPreference) -> bool:
    """Check if current time is within quiet hours"""
    if not preference.quiet_hours_start or not preference.quiet_hours_end:
        return False

    now = datetime.utcnow()
    current_time = now.strftime("%H:%M")

    # Simple comparison (you may want more sophisticated logic)
    if preference.quiet_hours_start <= preference.quiet_hours_end:
        return preference.quiet_hours_start <= current_time <= preference.quiet_hours_end
    else:  # Crosses midnight
    return current_time >= preference.quiet_hours_start or current_time <= preference.quiet_hours_end

# Notification Endpoints
@router.get("/", response_model=List[NotificationResponse])
async def get_notifications(
    is_read: Optional[bool] = None,
    notification_type: Optional[NotificationType] = None,
    priority: Optional[NotificationPriority] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get current user's notifications"""
    query = select(Notification).where(Notification.user_id == current_user.id)

    if is_read is not None:
        query = query.where(Notification.is_read == is_read)
    if notification_type:
        query = query.where(Notification.type == notification_type)
    if priority:
        query = query.where(Notification.priority == priority)

    query = query.order_by(Notification.created_at.desc())
    query = query.offset(skip).limit(limit)

    result = await db.execute(query)
    notifications = result.scalars().all()

    return notifications

@router.get("/summary", response_model=NotificationSummary)
async def get_notification_summary(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get notification summary for current user"""
    # Total notifications
    total_result = await db.execute(select(func.count(Notification.id)).where(Notification.user_id == current_user.id))
    total_count = total_result.scalar()

    # Unread notifications
    unread_result = await db.execute(select(func.count(Notification.id)).where(and_(
        Notification.user_id == current_user.id,
        Notification.is_read == False
    )))
    unread_count = unread_result.scalar()

    # Pending notifications
    pending_result = await db.execute(select(func.count(Notification.id)).where(and_(
        Notification.user_id == current_user.id,
        Notification.status == NotificationStatus.pending
    )))
    pending_count = pending_result.scalar()

    # Failed notifications
    failed_result = await db.execute(select(func.count(Notification.id)).where(and_(
        Notification.user_id == current_user.id,
        Notification.status == NotificationStatus.failed
    )))
    failed_count = failed_result.scalar()

    # High priority count
    high_priority_result = await db.execute(select(func.count(Notification.id)).where(and_(
        Notification.user_id == current_user.id,
        Notification.priority == NotificationPriority.high,
        Notification.is_read == False
    )))
    high_priority_count = high_priority_result.scalar()

    # Urgent count
    urgent_result = await db.execute(select(func.count(Notification.id)).where(and_(
        Notification.user_id == current_user.id,
        Notification.priority == NotificationPriority.urgent,
        Notification.is_read == False
    )))
    urgent_count = urgent_result.scalar()

    return NotificationSummary(
        total_notifications=total_count,
        unread_notifications=unread_count,
        pending_notifications=pending_count,
        failed_notifications=failed_count,
        high_priority_count=high_priority_count,
        urgent_count=urgent_count
    )

@router.get("/{notification_id}", response_model=NotificationResponse)
async def get_notification(
    notification_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get specific notification details"""
    result = await db.execute(select(Notification).where(and_(
        Notification.id == notification_id,
        Notification.user_id == current_user.id
    )))
    notification = result.scalar_one_or_none()

    if not notification:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")

    return notification

@router.post("/", response_model=NotificationResponse, status_code=status.HTTP_201_CREATED)
async def create_notification(
    notification: NotificationCreate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Create notification (Admin only)"""
    # Get user preferences
    pref_result = await db.execute(select(NotificationPreference).where(NotificationPreference.user_id == notification.user_id))
    preference = pref_result.scalar_one_or_none()

    if not preference:
        # Create default preferences
        preference = NotificationPreference(user_id=notification.user_id)
        db.add(preference)
        await db.flush()

    # Check if notification should be sent based on preferences
    should_send = False

    if notification.type == NotificationType.compliance_issue and preference.enable_compliance_alerts:
        should_send = True
    elif notification.type == NotificationType.csr_approval and preference.enable_csr_alerts:
        should_send = True
    elif notification.type == NotificationType.challenge_approval and preference.enable_challenge_alerts:
        should_send = True
    elif notification.type == NotificationType.badge_unlock and preference.enable_badge_alerts:
        should_send = True
    elif notification.type == NotificationType.policy_acknowledgement and preference.enable_policy_reminders:
        should_send = True
    elif notification.type == NotificationType.reward_redeemed and preference.enable_reward_alerts:
        should_send = True

    if not should_send:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Notification type disabled for this user")

    # Create notification
    notification_data = notification.model_dump()
    # Convert extra_data dict to JSON string for storage
    if 'extra_data' in notification_data and notification_data['extra_data']:
        import json
        notification_data['extra_data'] = json.dumps(notification_data['extra_data'])

    db_notification = Notification(**notification_data)
    db.add(db_notification)

    # Send notification in background
    background_tasks.add_task(send_notification, db, db_notification, preference)

    await db.commit()
    await db.refresh(db_notification)

    return db_notification

@router.post("/batch", response_model=List[NotificationResponse], status_code=status.HTTP_201_CREATED)
async def create_batch_notifications(
    batch: BatchNotificationCreate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Create batch notifications for multiple users (Admin only)"""
    created_notifications = []

    for user_id in batch.user_ids:
        # Get user preferences
        pref_result = await db.execute(select(NotificationPreference).where(NotificationPreference.user_id == user_id))
        preference = pref_result.scalar_one_or_none()

        if not preference:
            preference = NotificationPreference(user_id=user_id)
            db.add(preference)
            await db.flush()

        # Create notification
        notification_data = batch.notification.model_dump()
        notification_data['user_id'] = user_id

        db_notification = Notification(**notification_data)
        db.add(db_notification)

        # Send notification in background
        background_tasks.add_task(send_notification, db, db_notification, preference)

        created_notifications.append(db_notification)

    await db.commit()

    for notification in created_notifications:
        await db.refresh(notification)

    return created_notifications

@router.put("/{notification_id}", response_model=NotificationResponse)
async def update_notification(
    notification_id: UUID,
    notification_update: NotificationUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update notification (mark as read, etc.)"""
    result = await db.execute(select(Notification).where(and_(
        Notification.id == notification_id,
        Notification.user_id == current_user.id
    )))
    notification = result.scalar_one_or_none()

    if not notification:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")

    # Update fields
    if notification_update.is_read is not None:
        notification.is_read = notification_update.is_read
        if notification_update.is_read:
            notification.read_at = datetime.utcnow()

    if notification_update.status is not None:
        notification.status = notification_update.status

    await db.commit()
    await db.refresh(notification)

    return notification

@router.post("/mark-read", response_model=dict)
async def mark_notifications_as_read(
    request: NotificationMarkReadRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Mark multiple notifications as read"""
    result = await db.execute(select(Notification).where(and_(
        Notification.id.in_(request.notification_ids),
        Notification.user_id == current_user.id
    )))
    notifications = result.scalars().all()

    updated_count = 0
    for notification in notifications:
        if not notification.is_read:
            notification.is_read = True
            notification.read_at = datetime.utcnow()
            updated_count += 1

    await db.commit()

    return {"message": f"Marked {updated_count} notifications as read", "updated_count": updated_count}

@router.delete("/batch", response_model=dict)
async def delete_notifications(
    request: NotificationDeleteRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete multiple notifications"""
    result = await db.execute(select(Notification).where(and_(
        Notification.id.in_(request.notification_ids),
        Notification.user_id == current_user.id
    )))
    notifications = result.scalars().all()

    deleted_count = len(notifications)
    for notification in notifications:
        await db.delete(notification)

    await db.commit()

    return {"message": f"Deleted {deleted_count} notifications", "deleted_count": deleted_count}

# Notification Preferences Endpoints
@router.get("/preferences/me", response_model=NotificationPreferenceResponse)
async def get_my_preferences(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get current user's notification preferences"""
    result = await db.execute(select(NotificationPreference).where(NotificationPreference.user_id == current_user.id))
    preference = result.scalar_one_or_none()

    if not preference:
        # Create default preferences
        preference = NotificationPreference(user_id=current_user.id)
        db.add(preference)
        await db.commit()
        await db.refresh(preference)

    return preference

@router.put("/preferences/me", response_model=NotificationPreferenceResponse)
async def update_my_preferences(
    preference_update: NotificationPreferenceUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update current user's notification preferences"""
    result = await db.execute(select(NotificationPreference).where(NotificationPreference.user_id == current_user.id))
    preference = result.scalar_one_or_none()

    if not preference:
        preference = NotificationPreference(user_id=current_user.id)
        db.add(preference)

    # Update fields
    for field, value in preference_update.model_dump(exclude_unset=True).items():
        setattr(preference, field, value)

    await db.commit()
    await db.refresh(preference)

    return preference

@router.get("/preferences/{user_id}", response_model=NotificationPreferenceResponse)
async def get_user_preferences(
    user_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Get specific user's notification preferences (Admin only)"""
    result = await db.execute(select(NotificationPreference).where(NotificationPreference.user_id == user_id))
    preference = result.scalar_one_or_none()

    if not preference:
        preference = NotificationPreference(user_id=user_id)
        db.add(preference)
        await db.commit()
        await db.refresh(preference)

    return preference