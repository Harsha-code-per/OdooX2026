from fastapi import APIRouter, Depends, HTTPException, status, Query, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, or_
from typing import List, Optional
from uuid import UUID
from datetime import datetime, timedelta

from app.database import get_db
from app.models.compliance import (
    ComplianceIssue, ComplianceIssueComment, ComplianceIssueAttachment,
    ComplianceIssueCategory, ComplianceIssueSeverity, ComplianceIssueStatus
)
from app.models.user import User
from app.models.notification import Notification, NotificationType, NotificationPriority
from app.schemas.compliance import (
    ComplianceIssueCreate, ComplianceIssueUpdate, ComplianceIssueResponse,
    ComplianceIssueCommentCreate, ComplianceIssueCommentResponse,
    ComplianceIssueAttachmentCreate, ComplianceIssueAttachmentResponse,
    ComplianceIssueAssignment, ComplianceIssueEscalation,
    ComplianceOverdueCheck, ComplianceSummaryStats
)
from app.dependencies.auth import get_current_user, get_current_admin_user

router = APIRouter(prefix="/compliance", tags=["Compliance"])

# Helper function to check overdue issues
async def check_overdue_issues(db: AsyncSession):
    """Background task to check for overdue compliance issues"""
    try:
        now = datetime.utcnow()

        # Find issues that are overdue but not marked as such
        overdue_result = await db.execute(
            select(ComplianceIssue).where(and_(
                ComplianceIssue.status.in_([
                    ComplianceIssueStatus.open,
                    ComplianceIssueStatus.in_progress
                ]),
                ComplianceIssue.due_date < now,
                ComplianceIssue.is_overdue == False
            ))
        )
        overdue_issues = overdue_result.scalars().all()

        for issue in overdue_issues:
            issue.is_overdue = True
            issue.overdue_days = (now - issue.due_date).days

            # Create overdue notification if not already sent
            if not issue.overdue_notification_sent:
                notification = Notification(
                    user_id=issue.owner_id,
                    type=NotificationType.compliance_issue,
                    priority=NotificationPriority.high,
                    title="Compliance Issue Overdue",
                    message=f"Compliance issue '{issue.title}' is {issue.overdue_days} days overdue.",
                    action_url=f"/compliance/issues/{issue.id}"
                )
                db.add(notification)
                issue.overdue_notification_sent = True

        # Check for upcoming due dates (within 7 days)
        upcoming_date = now + timedelta(days=7)
        upcoming_result = await db.execute(
            select(ComplianceIssue).where(and_(
                ComplianceIssue.status.in_([
                    ComplianceIssueStatus.open,
                    ComplianceIssueStatus.in_progress
                ]),
                ComplianceIssue.due_date <= upcoming_date,
                ComplianceIssue.due_date > now,
                ComplianceIssue.upcoming_due_date_sent == False
            ))
        )
        upcoming_issues = upcoming_result.scalars().all()

        for issue in upcoming_issues:
            days_until_due = (issue.due_date - now).days

            notification = Notification(
                user_id=issue.owner_id,
                type=NotificationType.compliance_issue,
                priority=NotificationPriority.medium,
                title="Compliance Issue Due Soon",
                message=f"Compliance issue '{issue.title}' is due in {days_until_due} days.",
                action_url=f"/compliance/issues/{issue.id}"
            )
            db.add(notification)
            issue.upcoming_due_date_sent = True

        await db.commit()

    except Exception as e:
        # Log error but don't fail
        pass

# Compliance Issue Endpoints
@router.get("/issues", response_model=List[ComplianceIssueResponse])
async def get_compliance_issues(
    category: Optional[ComplianceIssueCategory] = None,
    severity: Optional[ComplianceIssueSeverity] = None,
    status: Optional[ComplianceIssueStatus] = None,
    owner_id: Optional[UUID] = None,
    department_id: Optional[UUID] = None,
    is_overdue: Optional[bool] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get compliance issues (filtered by user access)"""
    query = select(ComplianceIssue)

    # Non-admin users can only see their own issues or their department's issues
    if current_user.role.name != "admin":
        if current_user.role.name == "department_head" and current_user.department_id:
            # Department heads can see their department's issues
            query = query.where(or_(
                ComplianceIssue.owner_id == current_user.id,
                ComplianceIssue.department_id == current_user.department_id
            ))
        else:
            # Regular users see only their assigned issues
            query = query.where(ComplianceIssue.owner_id == current_user.id)

    if category:
        query = query.where(ComplianceIssue.category == category)
    if severity:
        query = query.where(ComplianceIssue.severity == severity)
    if status:
        query = query.where(ComplianceIssue.status == status)
    if owner_id:
        query = query.where(ComplianceIssue.owner_id == owner_id)
    if department_id:
        query = query.where(ComplianceIssue.department_id == department_id)
    if is_overdue is not None:
        query = query.where(ComplianceIssue.is_overdue == is_overdue)

    query = query.order_by(ComplianceIssue.due_date.asc(), ComplianceIssue.created_at.desc())
    query = query.offset(skip).limit(limit)

    result = await db.execute(query)
    issues = result.scalars().all()

    return issues

@router.get("/issues/summary", response_model=ComplianceSummaryStats)
async def get_compliance_summary(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get compliance issues summary statistics"""
    # Base query for current user or all users for admin
    if current_user.role.name == "admin":
        base_query = select(ComplianceIssue)
    else:
        base_query = select(ComplianceIssue).where(ComplianceIssue.owner_id == current_user.id)

    # Total issues
    total_result = await db.execute(select(func.count(ComplianceIssue.id)).where(base_query.where clause and))
    total_issues = total_result.scalar() or 0

    # Issues by status
    open_result = await db.execute(
        select(func.count(ComplianceIssue.id)).where(and_(
            ComplianceIssue.status == ComplianceIssueStatus.open,
            ComplianceIssue.owner_id == current_user.id if current_user.role.name != "admin" else True
        ))
    )
    open_issues = open_result.scalar() or 0

    in_progress_result = await db.execute(
        select(func.count(ComplianceIssue.id)).where(and_(
            ComplianceIssue.status == ComplianceIssueStatus.in_progress,
            ComplianceIssue.owner_id == current_user.id if current_user.role.name != "admin" else True
        ))
    )
    in_progress_issues = in_progress_result.scalar() or 0

    resolved_result = await db.execute(
        select(func.count(ComplianceIssue.id)).where(and_(
            ComplianceIssue.status == ComplianceIssueStatus.resolved,
            ComplianceIssue.owner_id == current_user.id if current_user.role.name != "admin" else True
        ))
    )
    resolved_issues = resolved_result.scalar() or 0

    closed_result = await db.execute(
        select(func.count(ComplianceIssue.id)).where(and_(
            ComplianceIssue.status == ComplianceIssueStatus.closed,
            ComplianceIssue.owner_id == current_user.id if current_user.role.name != "admin" else True
        ))
    )
    closed_issues = closed_result.scalar() or 0

    # Overdue issues
    overdue_result = await db.execute(
        select(func.count(ComplianceIssue.id)).where(and_(
            ComplianceIssue.is_overdue == True,
            ComplianceIssue.owner_id == current_user.id if current_user.role.name != "admin" else True
        ))
    )
    overdue_issues = overdue_result.scalar() or 0

    # Critical and high priority issues
    critical_result = await db.execute(
        select(func.count(ComplianceIssue.id)).where(and_(
            ComplianceIssue.severity == ComplianceIssueSeverity.critical,
            ComplianceIssue.owner_id == current_user.id if current_user.role.name != "admin" else True
        ))
    )
    critical_issues = critical_result.scalar() or 0

    high_priority_result = await db.execute(
        select(func.count(ComplianceIssue.id)).where(and_(
            ComplianceIssue.priority >= 4,
            ComplianceIssue.owner_id == current_user.id if current_user.role.name != "admin" else True
        ))
    )
    high_priority_issues = high_priority_result.scalar() or 0

    # Average resolution time (placeholder calculation)
    average_resolution_time_hours = None

    # Issues by category (simplified)
    issues_by_category = {}
    issues_by_severity = {}

    return ComplianceSummaryStats(
        total_issues=total_issues,
        open_issues=open_issues,
        in_progress_issues=in_progress_issues,
        resolved_issues=resolved_issues,
        closed_issues=closed_issues,
        overdue_issues=overdue_issues,
        critical_issues=critical_issues,
        high_priority_issues=high_priority_issues,
        average_resolution_time_hours=average_resolution_time_hours,
        issues_by_category=issues_by_category,
        issues_by_severity=issues_by_severity
    )

@router.get("/issues/overdue-check", response_model=ComplianceOverdueCheck)
async def check_overdue_compliance_issues(
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Check for overdue compliance issues (Admin only)"""
    # Trigger background check
    background_tasks.add_task(check_overdue_issues, db)

    now = datetime.utcnow()

    # Get overdue issues
    overdue_result = await db.execute(
        select(ComplianceIssue).where(and_(
            ComplianceIssue.is_overdue == True,
            ComplianceIssue.status.in_([
                ComplianceIssueStatus.open,
                ComplianceIssueStatus.in_progress
            ])
        )).order_by(ComplianceIssue.due_date.asc())
    )
    overdue_issues = overdue_result.scalars().all()

    # Get upcoming due dates (within 7 days)
    upcoming_date = now + timedelta(days=7)
    upcoming_result = await db.execute(
        select(ComplianceIssue).where(and_(
            ComplianceIssue.due_date <= upcoming_date,
            ComplianceIssue.due_date > now,
            ComplianceIssue.status.in_([
                ComplianceIssueStatus.open,
                ComplianceIssueStatus.in_progress
            ])
        )).order_by(ComplianceIssue.due_date.asc())
    )
    upcoming_issues = upcoming_result.scalars().all()

    return ComplianceOverdueCheck(
        overdue_count=len(overdue_issues),
        upcoming_due_count=len(upcoming_issues),
        overdue_issues=overdue_issues,
        upcoming_issues=upcoming_issues
    )

@router.get("/issues/{issue_id}", response_model=ComplianceIssueResponse)
async def get_compliance_issue(
    issue_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get specific compliance issue details"""
    result = await db.execute(select(ComplianceIssue).where(ComplianceIssue.id == issue_id))
    issue = result.scalar_one_or_none()

    if not issue:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Compliance issue not found")

    # Check permissions
    if current_user.role.name != "admin" and issue.owner_id != current_user.id:
        # Department heads can view their department's issues
        if current_user.role.name == "department_head" and issue.department_id:
            if issue.department_id != current_user.department_id:
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
        else:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    return issue

@router.post("/issues", response_model=ComplianceIssueResponse, status_code=status.HTTP_201_CREATED)
async def create_compliance_issue(
    issue: ComplianceIssueCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create new compliance issue"""
    db_issue = ComplianceIssue(**issue.model_dump())
    db_issue.created_by = current_user.id

    # Check if due date is in the past
    if db_issue.due_date < datetime.utcnow():
        db_issue.is_overdue = True
        db_issue.overdue_days = (datetime.utcnow() - db_issue.due_date).days

    db.add(db_issue)
    await db.commit()
    await db.refresh(db_issue)

    # Create notification for the assigned owner
    notification = Notification(
        user_id=db_issue.owner_id,
        type=NotificationType.compliance_issue,
        priority=NotificationPriority.high if db_issue.severity == ComplianceIssueSeverity.critical else NotificationPriority.medium,
        title="New Compliance Issue Assigned",
        message=f"You have been assigned a new compliance issue: {db_issue.title}",
        action_url=f"/compliance/issues/{db_issue.id}"
    )
    db.add(notification)

    await db.commit()
    await db.refresh(db_issue)

    return db_issue

@router.put("/issues/{issue_id}", response_model=ComplianceIssueResponse)
async def update_compliance_issue(
    issue_id: UUID,
    issue_update: ComplianceIssueUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update compliance issue"""
    result = await db.execute(select(ComplianceIssue).where(ComplianceIssue.id == issue_id))
    issue = result.scalar_one_or_none()

    if not issue:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Compliance issue not found")

    # Check permissions
    if current_user.role.name != "admin" and issue.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    # Update fields
    for field, value in issue_update.model_dump(exclude_unset=True).items():
        setattr(issue, field, value)

    issue.updated_by = current_user.id

    # Check if issue is being resolved or closed
    if issue_update.status in [ComplianceIssueStatus.resolved, ComplianceIssueStatus.closed]:
        if not issue.resolved_date:
            issue.resolved_date = datetime.utcnow()
        if issue_update.status == ComplianceIssueStatus.closed and not issue.closed_date:
            issue.closed_date = datetime.utcnow()

    # Re-check overdue status
    if issue_update.due_date:
        if issue_update.due_date < datetime.utcnow() and issue.status in [ComplianceIssueStatus.open, ComplianceIssueStatus.in_progress]:
            issue.is_overdue = True
            issue.overdue_days = (datetime.utcnow() - issue_update.due_date).days
        else:
            issue.is_overdue = False
            issue.overdue_days = 0

    await db.commit()
    await db.refresh(issue)

    return issue

@router.post("/issues/{issue_id}/assign", response_model=ComplianceIssueResponse)
async def assign_compliance_issue(
    issue_id: UUID,
    assignment: ComplianceIssueAssignment,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Assign compliance issue to new owner (Admin only)"""
    result = await db.execute(select(ComplianceIssue).where(ComplianceIssue.id == issue_id))
    issue = result.scalar_one_or_none()

    if not issue:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Compliance issue not found")

    # Update assignment
    issue.owner_id = assignment.new_owner_id
    issue.assigned_by = assignment.assigned_by
    issue.updated_by = current_user.id

    # Create notification for new owner
    notification = Notification(
        user_id=assignment.new_owner_id,
        type=NotificationType.compliance_issue,
        priority=NotificationPriority.medium,
        title="Compliance Issue Reassigned",
        message=f"Compliance issue '{issue.title}' has been reassigned to you. {assignment.notes if assignment.notes else ''}",
        action_url=f"/compliance/issues/{issue.id}"
    )
    db.add(notification)

    await db.commit()
    await db.refresh(issue)

    return issue

@router.post("/issues/{issue_id}/escalate", response_model=ComplianceIssueResponse)
async def escalate_compliance_issue(
    issue_id: UUID,
    escalation: ComplianceIssueEscalation,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Escalate compliance issue (Admin only)"""
    result = await db.execute(select(ComplianceIssue).where(ComplianceIssue.id == issue_id))
    issue = result.scalar_one_or_none()

    if not issue:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Compliance issue not found")

    # Update escalation
    issue.escalated_to = escalation.escalate_to
    issue.escalation_level = escalation.escalation_level
    issue.escalated_at = datetime.utcnow()
    issue.priority = min(5, issue.priority + 1)  # Increase priority

    # Create notification for escalatee
    notification = Notification(
        user_id=escalation.escalate_to,
        type=NotificationType.compliance_issue,
        priority=NotificationPriority.high,
        title="Compliance Issue Escalated",
        message=f"Compliance issue '{issue.title}' has been escalated to level {escalation.escalation_level}. {escalation.notes if escalation.notes else ''}",
        action_url=f"/compliance/issues/{issue.id}"
    )
    db.add(notification)

    await db.commit()
    await db.refresh(issue)

    return issue

# Comments and Attachments Endpoints
@router.get("/issues/{issue_id}/comments", response_model=List[ComplianceIssueCommentResponse])
async def get_issue_comments(
    issue_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get comments for compliance issue"""
    # Check if user can access the issue
    issue_result = await db.execute(select(ComplianceIssue).where(ComplianceIssue.id == issue_id))
    issue = issue_result.scalar_one_or_none()

    if not issue:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Compliance issue not found")

    # Check permissions
    if current_user.role.name != "admin" and issue.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    result = await db.execute(
        select(ComplianceIssueComment).where(ComplianceIssueComment.compliance_issue_id == issue_id)
        .order_by(ComplianceIssueComment.created_at.asc())
    )
    comments = result.scalars().all()

    return comments

@router.post("/issues/{issue_id}/comments", response_model=ComplianceIssueCommentResponse, status_code=status.HTTP_201_CREATED)
async def create_issue_comment(
    issue_id: UUID,
    comment: ComplianceIssueCommentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Add comment to compliance issue"""
    # Check if user can access the issue
    issue_result = await db.execute(select(ComplianceIssue).where(ComplianceIssue.id == issue_id))
    issue = issue_result.scalar_one_or_none()

    if not issue:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Compliance issue not found")

    # Check permissions
    if current_user.role.name != "admin" and issue.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    db_comment = ComplianceIssueComment(**comment.model_dump())
    db.add(db_comment)
    await db.commit()
    await db.refresh(db_comment)

    return db_comment

@router.get("/issues/{issue_id}/attachments", response_model=List[ComplianceIssueAttachmentResponse])
async def get_issue_attachments(
    issue_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get attachments for compliance issue"""
    # Check if user can access the issue
    issue_result = await db.execute(select(ComplianceIssue).where(ComplianceIssue.id == issue_id))
    issue = issue_result.scalar_one_or_none()

    if not issue:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Compliance issue not found")

    # Check permissions
    if current_user.role.name != "admin" and issue.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    result = await db.execute(
        select(ComplianceIssueAttachment).where(ComplianceIssueAttachment.compliance_issue_id == issue_id)
    )
    attachments = result.scalars().all()

    return attachments

@router.post("/issues/{issue_id}/attachments", response_model=ComplianceIssueAttachmentResponse, status_code=status.HTTP_201_CREATED)
async def create_issue_attachment(
    issue_id: UUID,
    attachment: ComplianceIssueAttachmentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Add attachment to compliance issue"""
    # Check if user can access the issue
    issue_result = await db.execute(select(ComplianceIssue).where(ComplianceIssue.id == issue_id))
    issue = issue_result.scalar_one_or_none()

    if not issue:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Compliance issue not found")

    # Check permissions
    if current_user.role.name != "admin" and issue.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    db_attachment = ComplianceIssueAttachment(**attachment.model_dump())
    db.add(db_attachment)
    await db.commit()
    await db.refresh(db_attachment)

    return db_attachment