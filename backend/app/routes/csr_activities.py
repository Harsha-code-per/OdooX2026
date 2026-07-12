from fastapi import APIRouter, Depends, HTTPException, status, Query, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, or_
from typing import List, Optional
from uuid import UUID
from datetime import datetime
import os

from app.database import get_db
from app.models.csr_activity import CSRActivity, EvidenceDocument, CSRActivityType, CSRActivityStatus
from app.models.reward import UserPoints, PointsTransaction
from app.models.user import User
from app.schemas.csr_activity import (
    CSRActivityCreate, CSRActivityUpdate, CSRActivityResponse,
    EvidenceDocumentCreate, EvidenceDocumentUpdate, EvidenceDocumentResponse,
    CSRActivityApprovalRequest, EvidenceUploadRequest,
    CSRSummaryStats, CSRActivityListResponse
)
from app.dependencies.auth import get_current_user, get_current_admin_user
from app.models.notification import Notification, NotificationType, NotificationPriority
from sqlalchemy import select, func, and_, or_

router = APIRouter(prefix="/csr", tags=["CSR Activities"])

# CSR Activity Endpoints
@router.get("/", response_model=CSRActivityListResponse)
async def get_csr_activities(
    activity_type: Optional[CSRActivityType] = None,
    status: Optional[CSRActivityStatus] = None,
    user_id: Optional[UUID] = None,
    department_id: Optional[UUID] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get CSR activities (filtered by user access)"""
    query = select(CSRActivity)

    # Non-admin users can only see their own activities
    if current_user.role.name != "admin" and not user_id:
        query = query.where(CSRActivity.user_id == current_user.id)
    elif user_id and current_user.role.name != "admin" and user_id != current_user.id:
        # Non-admin trying to view someone else's activities
        if current_user.role.name not in ["department_head", "asset_manager"]:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    if activity_type:
        query = query.where(CSRActivity.activity_type == activity_type)
    if status:
        query = query.where(CSRActivity.status == status)
    if user_id:
        query = query.where(CSRActivity.user_id == user_id)
    if department_id:
        query = query.where(CSRActivity.department_id == department_id)

    # Get total count
    count_result = await db.execute(select(func.count(CSRActivity.id)).where(query.where clause and))
    total_count = count_result.scalar() or 0

    query = query.order_by(CSRActivity.activity_date.desc())
    query = query.offset(skip).limit(limit)

    result = await db.execute(query)
    activities = result.scalars().all()

    return CSRActivityListResponse(
        activities=activities,
        total_count=total_count,
        page=skip // limit + 1 if limit > 0 else 1,
        page_size=limit,
        has_more=skip + limit < total_count
    )

@router.get("/summary", response_model=CSRSummaryStats)
async def get_csr_summary(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get CSR activity summary statistics"""
    # Base query for current user or all users for admin
    if current_user.role.name == "admin":
        base_query = select(CSRActivity)
    else:
        base_query = select(CSRActivity).where(CSRActivity.user_id == current_user.id)

    # Total activities
    total_result = await db.execute(select(func.count(CSRActivity.id)).where(base_query.where clause and))
    total_activities = total_result.scalar() or 0

    # Approved activities
    approved_result = await db.execute(
        select(func.count(CSRActivity.id)).where(and_(
            CSRActivity.status == CSRActivityStatus.approved,
            CSRActivity.user_id == current_user.id if current_user.role.name != "admin" else True
        ))
    )
    approved_activities = approved_result.scalar() or 0

    # Pending activities
    pending_result = await db.execute(
        select(func.count(CSRActivity.id)).where(and_(
            CSRActivity.status.in_([CSRActivityStatus.submitted, CSRActivityStatus.under_review]),
            CSRActivity.user_id == current_user.id if current_user.role.name != "admin" else True
        ))
    )
    pending_activities = pending_result.scalar() or 0

    # Calculate totals
    stats_result = await db.execute(
        select(
            func.sum(CSRActivity.hours_spent),
            func.sum(CSRActivity.beneficiaries_count),
            func.sum(CSRActivity.amount_donated),
            func.sum(CSRActivity.carbon_impact_kg),
            func.sum(CSRActivity.points_earned),
            func.sum(CSRActivity.xp_earned)
        ).where(
            and_(
                CSRActivity.status == CSRActivityStatus.approved,
                CSRActivity.user_id == current_user.id if current_user.role.name != "admin" else True
            )
        )
    )
    totals = stats_result.one()

    return CSRSummaryStats(
        total_activities=total_activities,
        approved_activities=approved_activities,
        pending_activities=pending_activities,
        total_volunteer_hours=totals[0] or 0,
        total_beneficiaries=totals[1] or 0,
        total_donations=totals[2] or 0,
        total_carbon_impact=totals[3] or 0,
        total_points_earned=totals[4] or 0,
        total_xp_earned=totals[5] or 0
    )

@router.get("/{activity_id}", response_model=CSRActivityResponse)
async def get_csr_activity(
    activity_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get specific CSR activity details"""
    result = await db.execute(select(CSRActivity).where(CSRActivity.id == activity_id))
    activity = result.scalar_one_or_none()

    if not activity:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="CSR activity not found")

    # Check permissions
    if current_user.role.name != "admin" and activity.user_id != current_user.id:
        # Department heads can view their department's activities
        if current_user.role.name == "department_head" and activity.department_id:
            if activity.department_id != current_user.department_id:
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
        else:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    return activity

@router.post("/", response_model=CSRActivityResponse, status_code=status.HTTP_201_CREATED)
async def create_csr_activity(
    activity: CSRActivityCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create new CSR activity"""
    # Set user_id if not provided
    if not activity.user_id:
        activity.user_id = current_user.id

    # Check if evidence is required but not provided
    if activity.evidence_required and activity.evidence_provided == False:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Evidence is required for this activity type. Please upload evidence documents."
        )

    db_activity = CSRActivity(**activity.model_dump())

    if not db_activity.user_id:
        db_activity.user_id = current_user.id

    db.add(db_activity)
    await db.commit()
    await db.refresh(db_activity)

    return db_activity

@router.put("/{activity_id}", response_model=CSRActivityResponse)
async def update_csr_activity(
    activity_id: UUID,
    activity_update: CSRActivityUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update CSR activity"""
    result = await db.execute(select(CSRActivity).where(CSRActivity.id == activity_id))
    activity = result.scalar_one_or_none()

    if not activity:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="CSR activity not found")

    # Check permissions
    if current_user.role.name != "admin" and activity.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    # Can only update draft activities
    if activity.status != CSRActivityStatus.draft and current_user.role.name != "admin":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Can only update draft activities")

    # Check evidence requirement if trying to submit
    if activity_update.status == CSRActivityStatus.submitted:
        if activity.evidence_required and not activity.evidence_provided:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot submit activity without required evidence documents"
            )
        activity.submitted_at = datetime.utcnow()

    # Update fields
    for field, value in activity_update.model_dump(exclude_unset=True).items():
        setattr(activity, field, value)

    await db.commit()
    await db.refresh(activity)

    return activity

@router.post("/submit/{activity_id}", response_model=CSRActivityResponse)
async def submit_csr_activity(
    activity_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Submit CSR activity for approval"""
    result = await db.execute(select(CSRActivity).where(CSRActivity.id == activity_id))
    activity = result.scalar_one_or_none()

    if not activity:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="CSR activity not found")

    # Check permissions
    if current_user.role.name != "admin" and activity.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    # Check if activity can be submitted
    if activity.status != CSRActivityStatus.draft:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Only draft activities can be submitted")

    # Check evidence requirement
    if activity.evidence_required and not activity.evidence_provided:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot submit activity without required evidence documents"
        )

    activity.status = CSRActivityStatus.submitted
    activity.submitted_at = datetime.utcnow()

    await db.commit()
    await db.refresh(activity)

    return activity

@router.post("/approve", response_model=CSRActivityResponse)
async def approve_csr_activity(
    approval: CSRActivityApprovalRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Approve or reject CSR activity (Admin only)"""
    result = await db.execute(select(CSRActivity).where(CSRActivity.id == approval.activity_id))
    activity = result.scalar_one_or_none()

    if not activity:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="CSR activity not found")

    # Check if activity can be approved
    if activity.status not in [CSRActivityStatus.submitted, CSRActivityStatus.under_review]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Activity cannot be approved in current status")

    if approval.approve:
        # Check evidence requirement again
        if activity.evidence_required and not activity.evidence_provided:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot approve activity without required evidence documents"
            )

        activity.status = CSRActivityStatus.approved
        activity.reviewed_by = current_user.id
        activity.reviewed_at = datetime.utcnow()
        activity.approval_notes = approval.approval_notes

        # Apply point overrides if provided
        if approval.points_override is not None:
            activity.points_earned = approval.points_override
        if approval.xp_override is not None:
            activity.xp_earned = approval.xp_override

        # Award points and XP to user
        points_transaction = PointsTransaction(
            user_id=activity.user_id,
            points=activity.points_earned,
            xp=activity.xp_earned,
            transaction_type="earned",
            source="csr",
            source_id=activity.id,
            description=f"CSR activity: {activity.title}"
        )
        db.add(points_transaction)

        # Update user points
        user_points_result = await db.execute(
            select(UserPoints).where(UserPoints.user_id == activity.user_id)
        )
        user_points = user_points_result.scalar_one_or_none()

        if user_points:
            user_points.total_points += activity.points_earned
            user_points.total_xp += activity.xp_earned
            user_points.available_points += activity.points_earned

        # Create approval notification
        notification = Notification(
            user_id=activity.user_id,
            type=NotificationType.csr_approval,
            priority=NotificationPriority.medium,
            title="CSR Activity Approved",
            message=f"Your CSR activity '{activity.title}' has been approved! You earned {activity.points_earned} points and {activity.xp_earned} XP.",
            action_url=f"/csr/activities/{activity.id}"
        )
        db.add(notification)

    else:
        # Reject the activity
        activity.status = CSRActivityStatus.rejected
        activity.reviewed_by = current_user.id
        activity.reviewed_at = datetime.utcnow()
        activity.approval_notes = approval.approval_notes

        # Create rejection notification
        notification = Notification(
            user_id=activity.user_id,
            type=NotificationType.csr_approval,
            priority=NotificationPriority.medium,
            title="CSR Activity Rejected",
            message=f"Your CSR activity '{activity.title}' has been rejected. {approval.approval_notes if approval.approval_notes else ''}",
            action_url=f"/csr/activities/{activity.id}"
        )
        db.add(notification)

    await db.commit()
    await db.refresh(activity)

    return activity

# Evidence Document Endpoints
@router.get("/{activity_id}/evidence", response_model[List[EvidenceDocumentResponse])
async def get_activity_evidence(
    activity_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get evidence documents for CSR activity"""
    # First check if user can access the activity
    activity_result = await db.execute(select(CSRActivity).where(CSRActivity.id == activity_id))
    activity = activity_result.scalar_one_or_none()

    if not activity:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="CSR activity not found")

    # Check permissions
    if current_user.role.name != "admin" and activity.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    # Get evidence documents
    result = await db.execute(
        select(EvidenceDocument).where(EvidenceDocument.csr_activity_id == activity_id)
    )
    documents = result.scalars().all()

    return documents

@router.post("/evidence/upload", response_model=EvidenceDocumentResponse, status_code=status.HTTP_201_CREATED)
async def upload_evidence(
    file: UploadFile = File(...),
    csr_activity_id: UUID = Query(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Upload evidence document for CSR activity"""
    # Check if activity exists and user has access
    activity_result = await db.execute(select(CSRActivity).where(CSRActivity.id == csr_activity_id))
    activity = activity_result.scalar_one_or_none()

    if not activity:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="CSR activity not found")

    # Check permissions
    if current_user.role.name != "admin" and activity.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    # Generate file path (you'd want to implement proper file storage)
    file_extension = file.filename.split('.')[-1] if '.' in file.filename else ''
    file_path = f"uploads/evidence/{csr_activity_id}/{file.filename}"

    # Save file (this is a simplified version - you'd want proper file handling)
    os.makedirs(f"uploads/evidence/{csr_activity_id}", exist_ok=True)

    try:
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"File upload failed: {str(e)}")

    # Create evidence document record
    document = EvidenceDocument(
        csr_activity_id=csr_activity_id,
        user_id=current_user.id,
        file_name=file.filename,
        file_path=file_path,
        file_size=file.size if hasattr(file, 'size') else len(content),
        file_type=file.content_type or "application/octet-stream",
        file_extension=file_extension
    )

    db.add(document)

    # Update activity evidence status
    activity.evidence_provided = True
    activity.evidence_file_count += 1

    await db.commit()
    await db.refresh(document)

    return document

@router.delete("/evidence/{document_id}", response_model=dict)
async def delete_evidence(
    document_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete evidence document"""
    result = await db.execute(select(EvidenceDocument).where(EvidenceDocument.id == document_id))
    document = result.scalar_one_or_none()

    if not document:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Evidence document not found")

    # Check permissions
    if current_user.role.name != "admin" and document.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    # Get activity to update evidence count
    activity_result = await db.execute(select(CSRActivity).where(CSRActivity.id == document.csr_activity_id))
    activity = activity_result.scalar_one_or_none()

    if activity:
        activity.evidence_file_count = max(0, activity.evidence_file_count - 1)
        if activity.evidence_file_count == 0:
            activity.evidence_provided = False

    # Delete file from filesystem
    try:
        if os.path.exists(document.file_path):
            os.remove(document.file_path)
    except Exception as e:
        # Log error but continue with database deletion
        pass

    await db.delete(document)
    await db.commit()

    return {"message": "Evidence document deleted successfully"}