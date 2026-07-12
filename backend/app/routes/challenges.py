from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, or_
from typing import List, Optional
from uuid import UUID
from datetime import datetime

from app.database import get_db
from app.models.challenge import Challenge, ChallengeParticipation
from app.models.reward import UserPoints, PointsTransaction
from app.models.user import User
from app.models.notification import Notification, NotificationType, NotificationPriority
from app.schemas.challenge import (
    ChallengeCreate, ChallengeUpdate, ChallengeResponse,
    ChallengeParticipationResponse, ChallengeProgressUpdateRequest
)
from app.dependencies.auth import get_current_user, get_current_admin_user

router = APIRouter(prefix="/challenges", tags=["Challenges"])

# Helper function to ensure user points record exists
async def ensure_user_points(db: AsyncSession, user_id: UUID) -> UserPoints:
    result = await db.execute(select(UserPoints).where(UserPoints.user_id == user_id))
    user_points = result.scalar_one_or_none()

    if not user_points:
        user_points = UserPoints(
            user_id=user_id,
            total_points=0,
            total_xp=0,
            available_points=0,
            redeemed_points=0
        )
        db.add(user_points)
        await db.flush()

    return user_points

@router.get("/", response_model=List[ChallengeResponse])
async def get_challenges(
    category: Optional[str] = None,
    status_filter: Optional[str] = Query(None, alias="status"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get active list of challenges"""
    query = select(Challenge)
    
    if category:
        query = query.where(Challenge.category == category)
    if status_filter:
        query = query.where(Challenge.status == status_filter)
    else:
        # Default to showing active challenges
        query = query.where(Challenge.status == "active")

    result = await db.execute(query.order_by(Challenge.deadline.asc()))
    return result.scalars().all()

@router.get("/participations", response_model=List[ChallengeParticipationResponse])
async def get_my_participations(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get current user's challenge participations"""
    result = await db.execute(
        select(ChallengeParticipation)
        .where(ChallengeParticipation.user_id == current_user.id)
    )
    participations = result.scalars().all()
    
    # Load associated challenges
    for p in participations:
        challenge_res = await db.execute(select(Challenge).where(Challenge.id == p.challenge_id))
        p.challenge = challenge_res.scalar_one_or_none()
        
    return participations

@router.post("/", response_model=ChallengeResponse, status_code=status.HTTP_201_CREATED)
async def create_challenge(
    challenge_data: ChallengeCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Create a new challenge (Admin only)"""
    new_challenge = Challenge(
        title=challenge_data.title,
        description=challenge_data.description,
        category=challenge_data.category,
        difficulty=challenge_data.difficulty,
        xp_reward=challenge_data.xp_reward,
        points_reward=challenge_data.points_reward,
        status=challenge_data.status,
        deadline=challenge_data.deadline
    )
    db.add(new_challenge)
    await db.commit()
    await db.refresh(new_challenge)
    return new_challenge

@router.get("/{challenge_id}", response_model=ChallengeResponse)
async def get_challenge(
    challenge_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get specific challenge details"""
    result = await db.execute(select(Challenge).where(Challenge.id == challenge_id))
    challenge = result.scalar_one_or_none()
    
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")
    return challenge

@router.post("/{challenge_id}/join", response_model=ChallengeParticipationResponse)
async def join_challenge(
    challenge_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Join a challenge"""
    # Verify challenge exists and is active
    chal_result = await db.execute(select(Challenge).where(Challenge.id == challenge_id))
    challenge = chal_result.scalar_one_or_none()
    
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")
    if challenge.status != "active":
        raise HTTPException(status_code=400, detail="Challenge is not currently active")
        
    # Check if already joined
    part_result = await db.execute(
        select(ChallengeParticipation).where(
            and_(
                ChallengeParticipation.challenge_id == challenge_id,
                ChallengeParticipation.user_id == current_user.id
            )
        )
    )
    existing_part = part_result.scalar_one_or_none()
    if existing_part:
        existing_part.challenge = challenge
        return existing_part
        
    # Join challenge
    new_part = ChallengeParticipation(
        challenge_id=challenge_id,
        user_id=current_user.id,
        progress=0,
        status="in_progress"
    )
    db.add(new_part)
    await db.commit()
    await db.refresh(new_part)
    new_part.challenge = challenge
    return new_part

@router.post("/{challenge_id}/progress", response_model=ChallengeParticipationResponse)
async def update_challenge_progress(
    challenge_id: UUID,
    update_data: ChallengeProgressUpdateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update challenge progress and award points/XP upon completion"""
    # Find participation
    part_result = await db.execute(
        select(ChallengeParticipation).where(
            and_(
                ChallengeParticipation.challenge_id == challenge_id,
                ChallengeParticipation.user_id == current_user.id
            )
        )
    )
    participation = part_result.scalar_one_or_none()
    if not participation:
        raise HTTPException(status_code=404, detail="Participation record not found. You must join this challenge first.")
        
    challenge_res = await db.execute(select(Challenge).where(Challenge.id == challenge_id))
    challenge = challenge_res.scalar_one_or_none()
    participation.challenge = challenge
    
    if participation.status == "completed":
         return participation

    participation.progress = update_data.progress
    participation.status = update_data.status
    if update_data.proof_file:
         participation.proof_file = update_data.proof_file

    # Award points if status becomes completed
    if update_data.status == "completed" or update_data.progress >= 100:
         participation.progress = 100
         participation.status = "completed"
         participation.completed_at = datetime.utcnow()
         participation.points_awarded = challenge.points_reward
         participation.xp_awarded = challenge.xp_reward

         # Add PointsTransaction
         points_transaction = PointsTransaction(
             user_id=current_user.id,
             points=challenge.points_reward,
             xp=challenge.xp_reward,
             transaction_type="earned",
             source="challenge",
             source_id=participation.id,
             description=f"Completed challenge: {challenge.title}"
         )
         db.add(points_transaction)

         # Update user points
         user_points = await ensure_user_points(db, current_user.id)
         user_points.total_points += challenge.points_reward
         user_points.total_xp += challenge.xp_reward
         user_points.available_points += challenge.points_reward

         # Dispatch Badge Auto-Award logic if any milestone met
         # Trigger a notification
         notification = Notification(
             user_id=current_user.id,
             type=NotificationType.system if hasattr(NotificationType, 'system') else NotificationType.csr_approval,
             priority=NotificationPriority.medium,
             title="Challenge Completed!",
             message=f"Congratulations! You completed the challenge '{challenge.title}' and earned {challenge.points_reward} points & {challenge.xp_reward} XP.",
             action_url=f"/social"
         )
         db.add(notification)

    await db.commit()
    await db.refresh(participation)
    participation.challenge = challenge
    return participation
