from fastapi import APIRouter, Depends, HTTPException, status, Query, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, or_
from typing import List, Optional
from uuid import UUID
from datetime import datetime
import json

from app.database import get_db
from app.models.badge import Badge, BadgeUnlockRule, UserBadge, BadgeProgress, BadgeCategory, BadgeUnlockMetric
from app.models.user import User
from app.models.reward import UserPoints, PointsTransaction
from app.models.csr_activity import CSRActivity
from app.schemas.badge import (
    BadgeCreate, BadgeUpdate, BadgeResponse,
    BadgeUnlockRuleCreate, BadgeUnlockRuleUpdate, BadgeUnlockRuleResponse,
    UserBadgeCreate, UserBadgeUpdate, UserBadgeResponse,
    BadgeProgressCreate, BadgeProgressUpdate, BadgeProgressResponse,
    BadgeAwardRequest, BadgeAutoAwardResult, BadgeUserStats
)
from app.dependencies.auth import get_current_user, get_current_admin_user
from app.models.notification import Notification, NotificationType, NotificationPriority
from sqlalchemy import select, func, and_, or_

router = APIRouter(prefix="/badges", tags=["Badges"])

# Badge Endpoints
@router.get("/", response_model=List[BadgeResponse])
async def get_badges(
    category: Optional[BadgeCategory] = None,
    is_active: bool = True,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get available badges"""
    query = select(Badge).where(Badge.is_active == is_active)

    if category:
        query = query.where(Badge.category == category)

    query = query.order_by(Badge.display_order.desc(), Badge.name.asc())
    query = query.offset(skip).limit(limit)

    result = await db.execute(query)
    badges = result.scalars().all()

    return badges

@router.get("/{badge_id}", response_model=BadgeResponse)
async def get_badge(
    badge_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get specific badge details"""
    result = await db.execute(select(Badge).where(Badge.id == badge_id))
    badge = result.scalar_one_or_none()

    if not badge:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Badge not found")

    return badge

@router.post("/", response_model=BadgeResponse, status_code=status.HTTP_201_CREATED)
async def create_badge(
    badge: BadgeCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Create new badge (Admin only)"""
    # Check if badge with same name exists
    existing = await db.execute(select(Badge).where(Badge.name == badge.name))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Badge with this name already exists")

    db_badge = Badge(**badge.model_dump())
    db.add(db_badge)
    await db.commit()
    await db.refresh(db_badge)

    return db_badge

@router.put("/{badge_id}", response_model=BadgeResponse)
async def update_badge(
    badge_id: UUID,
    badge: BadgeUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Update badge (Admin only)"""
    result = await db.execute(select(Badge).where(Badge.id == badge_id))
    db_badge = result.scalar_one_or_none()

    if not db_badge:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Badge not found")

    # Update fields
    for field, value in badge.model_dump(exclude_unset=True).items():
        setattr(db_badge, field, value)

    await db.commit()
    await db.refresh(db_badge)

    return db_badge

@router.delete("/{badge_id}", response_model=dict)
async def delete_badge(
    badge_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Delete badge (Admin only)"""
    result = await db.execute(select(Badge).where(Badge.id == badge_id))
    badge = result.scalar_one_or_none()

    if not badge:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Badge not found")

    await db.delete(badge)
    await db.commit()

    return {"message": "Badge deleted successfully"}

# Badge Unlock Rules Endpoints
@router.get("/{badge_id}/rules", response_model=List[BadgeUnlockRuleResponse])
async def get_badge_unlock_rules(
    badge_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get unlock rules for a badge"""
    result = await db.execute(
        select(BadgeUnlockRule).where(BadgeUnlockRule.badge_id == badge_id)
        .order_by(BadgeUnlockRule.priority.asc())
    )
    rules = result.scalars().all()

    return rules

@router.post("/{badge_id}/rules", response_model=BadgeUnlockRuleResponse, status_code=status.HTTP_201_CREATED)
async def create_badge_unlock_rule(
    badge_id: UUID,
    rule: BadgeUnlockRuleCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Create unlock rule for badge (Admin only)"""
    # Verify badge exists
    badge_result = await db.execute(select(Badge).where(Badge.id == badge_id))
    if not badge_result.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Badge not found")

    db_rule = BadgeUnlockRule(**rule.model_dump(), badge_id=badge_id)
    db.add(db_rule)
    await db.commit()
    await db.refresh(db_rule)

    return db_rule

# User Badge Endpoints
@router.get("/user/{user_id}", response_model=List[UserBadgeResponse])
async def get_user_badges(
    user_id: UUID,
    is_displayed: Optional[bool] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get user's badges"""
    query = select(UserBadge).where(UserBadge.user_id == user_id)

    if is_displayed is not None:
        query = query.where(UserBadge.is_displayed == is_displayed)

    query = query.order_by(UserBadge.awarded_at.desc())
    query = query.offset(skip).limit(limit)

    result = await db.execute(query)
    user_badges = result.scalars().all()

    return user_badges

@router.get("/user/{user_id}/progress", response_model=List[BadgeProgressResponse])
async def get_user_badge_progress(
    user_id: UUID,
    is_unlocked: Optional[bool] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get user's badge progress"""
    query = select(BadgeProgress).where(BadgeProgress.user_id == user_id)

    if is_unlocked is not None:
        query = query.where(BadgeProgress.is_unlocked == is_unlocked)

    query = query.order_by(BadgeProgress.progress_percentage.desc())
    query = query.offset(skip).limit(limit)

    result = await db.execute(query)
    progress_records = result.scalars().all()

    return progress_records

@router.get("/user/{user_id}/stats", response_model=BadgeUserStats)
async def get_user_badge_stats(
    user_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get user's badge statistics"""
    # Total badges count
    total_result = await db.execute(
        select(func.count(UserBadge.id)).where(UserBadge.user_id == user_id)
    )
    total_badges = total_result.scalar() or 0

    # Get all user badges for nested analysis
    badges_result = await db.execute(
        select(UserBadge).where(UserBadge.user_id == user_id)
    )
    user_badges = badges_result.scalars().all()

    unlocked_badges = sum(1 for badge in user_badges if badge.earned_date is not None)

    # Get progress records
    progress_result = await db.execute(
        select(BadgeProgress).where(BadgeProgress.user_id == user_id)
    )
    progress_records = progress_result.scalars().all()

    in_progress_badges = sum(1 for progress in progress_records if not progress.is_unlocked and progress.progress_percentage > 0)
    locked_badges = sum(1 for progress in progress_records if progress.progress_percentage == 0)

    # Get latest badges
    latest_badges = sorted(user_badges, key=lambda x: x.awarded_at, reverse=True)[:5]

    # Get rarest badges (would need badge rarity info)
    rarest_badges = []

    return BadgeUserStats(
        user_id=user_id,
        total_badges=total_badges,
        unlocked_badges=unlocked_badges,
        in_progress_badges=in_progress_badges,
        locked_badges=locked_badges,
        latest_badges=latest_badges,
        rarest_badges=rarest_badges
    )

@router.post("/award", response_model=UserBadgeResponse, status_code=status.HTTP_201_CREATED)
async def award_badge(
    award: BadgeAwardRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Manually award badge to user (Admin only)"""
    # Check if badge exists
    badge_result = await db.execute(select(Badge).where(Badge.id == award.badge_id))
    badge = badge_result.scalar_one_or_none()
    if not badge:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Badge not found")

    # Check if user already has this badge
    existing_result = await db.execute(
        select(UserBadge).where(and_(
            UserBadge.user_id == award.user_id,
            UserBadge.badge_id == award.badge_id
        ))
    )
    if existing_result.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User already has this badge")

    # Check if badge is limited
    if badge.is_limited and badge.max_awards and badge.total_awarded >= badge.max_awards:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Badge has reached maximum awards")

    # Create user badge
    user_badge = UserBadge(
        user_id=award.user_id,
        badge_id=award.badge_id,
        awarded_by=award.awarded_by or current_user.id,
        auto_awarded=award.auto_awarded,
        award_metadata=award.award_metadata,
        current_value=badge.unlock_threshold,
        target_value=badge.unlock_threshold,
        progress_percentage=100
    )

    db.add(user_badge)

    # Update badge awarded count
    badge.total_awarded += 1

    # Award points and XP
    if badge.points_reward > 0 or badge.xp_reward > 0:
        points_transaction = PointsTransaction(
            user_id=award.user_id,
            points=badge.points_reward,
            xp=badge.xp_reward,
            transaction_type="bonus",
            source="badge",
            source_id=badge.id,
            description=f"Badge awarded: {badge.name}"
        )
        db.add(points_transaction)

        # Update user points
        user_points_result = await db.execute(
            select(UserPoints).where(UserPoints.user_id == award.user_id)
        )
        user_points = user_points_result.scalar_one_or_none()

        if user_points:
            user_points.total_points += badge.points_reward
            user_points.total_xp += badge.xp_reward
            user_points.available_points += badge.points_reward

    # Create notification
    notification = Notification(
        user_id=award.user_id,
        type=NotificationType.badge_unlock,
        priority=NotificationPriority.medium,
        title="Badge Awarded!",
        message=f"Congratulations! You've been awarded the '{badge.name}' badge!",
        action_url=f"/badges/{badge.id}"
    )
    db.add(notification)

    await db.commit()
    await db.refresh(user_badge)

    return user_badge

# Auto-Award Badges Endpoint
@router.post("/auto-award", response_model=BadgeAutoAwardResult)
async def auto_award_badges(
    background_tasks: BackgroundTasks,
    user_id: Optional[UUID] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Automatically award badges based on unlock criteria (Admin only)"""
    awarded_count = 0
    skipped_count = 0
    failed_count = 0
    awarded_badges = []
    errors = []

    try:
        # Get users to process
        if user_id:
            users_query = select(User).where(User.id == user_id)
        else:
            users_query = select(User).where(User.status == "active")

        users_result = await db.execute(users_query)
        users = users_result.scalars().all()

        # Get badges with auto-award enabled
        badges_result = await db.execute(
            select(Badge).where(Badge.auto_award == True).where(Badge.is_active == True)
        )
        auto_badges = badges_result.scalars().all()

        for user in users:
            for badge in auto_badges:
                try:
                    # Check if user already has this badge
                    existing_result = await db.execute(
                        select(UserBadge).where(and_(
                            UserBadge.user_id == user.id,
                            UserBadge.badge_id == badge.id
                        ))
                    )
                    if existing_result.scalar_one_or_none():
                        skipped_count += 1
                        continue

                    # Check if badge is limited and max awards reached
                    if badge.is_limited and badge.max_awards and badge.total_awarded >= badge.max_awards:
                        skipped_count += 1
                        continue

                    # Get user's current metric value
                    metric_value = 0

                    if badge.unlock_metric == BadgeUnlockMetric.total_xp:
                        points_result = await db.execute(
                            select(UserPoints).where(UserPoints.user_id == user.id)
                        )
                        user_points = points_result.scalar_one_or_none()
                        metric_value = user_points.total_xp if user_points else 0

                    elif badge.unlock_metric == BadgeUnlockMetric.completed_challenges:
                        # Count completed challenges (you'd need to implement challenge tracking)
                        metric_value = 0  # Placeholder

                    elif badge.unlock_metric == BadgeUnlockMetric.csr_activities:
                        # Count approved CSR activities
                        csr_result = await db.execute(
                            select(func.count()).select_from(CSRActivity).where(and_(
                                CSRActivity.user_id == user.id,
                                CSRActivity.status == "approved"
                            ))
                        )
                        metric_value = csr_result.scalar() or 0

                    # Check if threshold is met
                    if metric_value >= badge.unlock_threshold:
                        # Award the badge
                        user_badge = UserBadge(
                            user_id=user.id,
                            badge_id=badge.id,
                            auto_awarded=True,
                            current_value=metric_value,
                            target_value=badge.unlock_threshold,
                            progress_percentage=100
                        )

                        db.add(user_badge)
                        badge.total_awarded += 1

                        # Award points and XP
                        if badge.points_reward > 0 or badge.xp_reward > 0:
                            points_transaction = PointsTransaction(
                                user_id=user.id,
                                points=badge.points_reward,
                                xp=badge.xp_reward,
                                transaction_type="bonus",
                                source="badge",
                                source_id=badge.id,
                                description=f"Auto-awarded badge: {badge.name}"
                            )
                            db.add(points_transaction)

                            # Update user points
                            user_points_result = await db.execute(
                                select(UserPoints).where(UserPoints.user_id == user.id)
                            )
                            user_points = user_points_result.scalar_one_or_none()

                            if user_points:
                                user_points.total_points += badge.points_reward
                                user_points.total_xp += badge.xp_reward
                                user_points.available_points += badge.points_reward

                        # Create notification
                        notification = Notification(
                            user_id=user.id,
                            type=NotificationType.badge_unlock,
                            priority=NotificationPriority.medium,
                            title="Badge Unlocked!",
                            message=f"Congratulations! You've unlocked the '{badge.name}' badge!",
                            action_url=f"/badges/{badge.id}"
                        )
                        db.add(notification)

                        awarded_badges.append(user_badge)
                        awarded_count += 1
                    else:
                        skipped_count += 1

                except Exception as e:
                    failed_count += 1
                    errors.append(f"User {user.id}, Badge {badge.id}: {str(e)}")

        await db.commit()

        # Refresh the awarded badges
        for badge in awarded_badges:
            await db.refresh(badge)

        return BadgeAutoAwardResult(
            success=failed_count == 0,
            awarded_count=awarded_count,
            skipped_count=skipped_count,
            failed_count=failed_count,
            awarded_badges=awarded_badges,
            errors=errors
        )

    except Exception as e:
        return BadgeAutoAwardResult(
            success=False,
            awarded_count=0,
            skipped_count=0,
            failed_count=1,
            errors=[str(e)]
        )