from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, or_
from typing import List, Optional
from uuid import UUID
from datetime import datetime

from app.database import get_db
from app.models.reward import Reward, RewardRedemption, UserPoints, PointsTransaction, RewardStatus, RedemptionStatus
from app.models.user import User
from app.schemas.reward import (
    RewardCreate, RewardUpdate, RewardResponse,
    RewardRedemptionCreate, RewardRedemptionUpdate, RewardRedemptionResponse,
    UserPointsResponse, PointsTransactionCreate, PointsTransactionResponse,
    LeaderboardEntry, RedemptionSummary
)
from app.dependencies.auth import get_current_user, get_current_admin_user

router = APIRouter(prefix="/rewards", tags=["Rewards"])

# Helper function to ensure user has points record
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

# Reward Catalog Endpoints
@router.get("/catalog", response_model=List[RewardResponse])
async def get_reward_catalog(
    category: Optional[str] = None,
    status: RewardStatus = RewardStatus.available,
    min_points: Optional[int] = None,
    max_points: Optional[int] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get available rewards catalog"""
    query = select(Reward).where(Reward.status == status)

    if category:
        query = query.where(Reward.category == category)
    if min_points is not None:
        query = query.where(Reward.points_required >= min_points)
    if max_points is not None:
        query = query.where(Reward.points_required <= max_points)

    query = query.order_by(Reward.display_order.desc(), Reward.points_required.asc())
    query = query.offset(skip).limit(limit)

    result = await db.execute(query)
    rewards = result.scalars().all()

    return rewards

@router.get("/catalog/{reward_id}", response_model=RewardResponse)
async def get_reward_details(
    reward_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get specific reward details"""
    result = await db.execute(select(Reward).where(Reward.id == reward_id))
    reward = result.scalar_one_or_none()

    if not reward:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reward not found")

    return reward

@router.post("/catalog", response_model=RewardResponse, status_code=status.HTTP_201_CREATED)
async def create_reward(
    reward: RewardCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Create new reward (Admin only)"""
    # Check if reward with same name exists
    existing = await db.execute(select(Reward).where(Reward.name == reward.name))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Reward with this name already exists")

    db_reward = Reward(**reward.model_dump())
    db.add(db_reward)
    await db.commit()
    await db.refresh(db_reward)

    return db_reward

@router.put("/catalog/{reward_id}", response_model=RewardResponse)
async def update_reward(
    reward_id: UUID,
    reward: RewardUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Update reward (Admin only)"""
    result = await db.execute(select(Reward).where(Reward.id == reward_id))
    db_reward = result.scalar_one_or_none()

    if not db_reward:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reward not found")

    # Update fields
    for field, value in reward.model_dump(exclude_unset=True).items():
        setattr(db_reward, field, value)

    await db.commit()
    await db.refresh(db_reward)

    return db_reward

# User Points Endpoints
@router.get("/points", response_model=UserPointsResponse)
async def get_user_points(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get current user's points balance"""
    user_points = await ensure_user_points(db, current_user.id)
    return user_points

@router.get("/points/transactions", response_model=List[PointsTransactionResponse])
async def get_points_transactions(
    transaction_type: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get user's points transaction history"""
    query = select(PointsTransaction).where(PointsTransaction.user_id == current_user.id)

    if transaction_type:
        query = query.where(PointsTransaction.transaction_type == transaction_type)

    query = query.order_by(PointsTransaction.created_at.desc())
    query = query.offset(skip).limit(limit)

    result = await db.execute(query)
    transactions = result.scalars().all()

    return transactions

@router.post("/points/transactions", response_model=PointsTransactionResponse, status_code=status.HTTP_201_CREATED)
async def create_points_transaction(
    transaction: PointsTransactionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Create manual points transaction (Admin only)"""
    # Ensure user has points record
    user_points = await ensure_user_points(db, transaction.user_id)

    # Create transaction
    db_transaction = PointsTransaction(**transaction.model_dump())
    db.add(db_transaction)

    # Update user points
    user_points.total_points += transaction.points
    user_points.total_xp += transaction.xp
    if transaction.points > 0:
        user_points.available_points += transaction.points
    else:
        user_points.available_points = max(0, user_points.available_points + transaction.points)
        user_points.redeemed_points += abs(transaction.points)

    await db.commit()
    await db.refresh(db_transaction)

    return db_transaction

# Reward Redemption Endpoints
@router.post("/redeem", response_model=RewardRedemptionResponse, status_code=status.HTTP_201_CREATED)
async def redeem_reward(
    redemption: RewardRedemptionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Redeem a reward"""
    # Get reward details
    result = await db.execute(select(Reward).where(Reward.id == redemption.reward_id))
    reward = result.scalar_one_or_none()

    if not reward:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reward not found")

    if reward.status != RewardStatus.available:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Reward is not available for redemption")

    if reward.stock_quantity <= 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Reward is out of stock")

    # Get user points
    user_points = await ensure_user_points(db, current_user.id)

    if user_points.available_points < reward.points_required:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Insufficient points balance")

    # Create redemption
    db_redemption = RewardRedemption(
        user_id=current_user.id,
        reward_id=redemption.reward_id,
        points_used=reward.points_required,
        status=RedemptionStatus.pending,
        notes=redemption.notes
    )
    db.add(db_redemption)

    # Deduct points
    user_points.available_points -= reward.points_required
    user_points.redeemed_points += reward.points_required

    # Create transaction
    transaction = PointsTransaction(
        user_id=current_user.id,
        points=-reward.points_required,
        xp=0,
        transaction_type="redeemed",
        source="reward",
        source_id=reward.id,
        description=f"Redeemed reward: {reward.name}"
    )
    db.add(transaction)

    # Update stock
    reward.stock_quantity -= 1
    if reward.stock_quantity == 0:
        reward.status = RewardStatus.out_of_stock

    await db.commit()
    await db.refresh(db_redemption)

    return db_redemption

@router.get("/redemptions", response_model=List[RewardRedemptionResponse])
async def get_user_redemptions(
    status_filter: Optional[RedemptionStatus] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get user's reward redemptions"""
    query = select(RewardRedemption).where(RewardRedemption.user_id == current_user.id)

    if status_filter:
        query = query.where(RewardRedemption.status == status_filter)

    query = query.order_by(RewardRedemption.created_at.desc())
    query = query.offset(skip).limit(limit)

    result = await db.execute(query)
    redemptions = result.scalars().all()

    return redemptions

@router.put("/redemptions/{redemption_id}", response_model=RewardRedemptionResponse)
async def update_redemption_status(
    redemption_id: UUID,
    redemption_update: RewardRedemptionUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Update redemption status (Admin only)"""
    result = await db.execute(select(RewardRedemption).where(RewardRedemption.id == redemption_id))
    db_redemption = result.scalar_one_or_none()

    if not db_redemption:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Redemption not found")

    # Update status
    db_redemption.status = redemption_update.status
    db_redemption.processed_by = current_user.id
    db_redemption.processed_at = datetime.utcnow()

    if redemption_update.notes:
        db_redemption.notes = redemption_update.notes

    if redemption_update.status == RedemptionStatus.fulfilled:
        db_redemption.fulfilled_at = datetime.utcnow()
    elif redemption_update.status == RedemptionStatus.rejected:
        # Refund points
        user_points = await ensure_user_points(db, db_redemption.user_id)
        user_points.available_points += db_redemption.points_used
        user_points.redeemed_points -= db_redemption.points_used

        # Create refund transaction
        transaction = PointsTransaction(
            user_id=db_redemption.user_id,
            points=db_redemption.points_used,
            xp=0,
            transaction_type="bonus",
            source="reward_refund",
            source_id=db_redemption.id,
            description=f"Refunded rejected reward redemption"
        )
        db.add(transaction)

    await db.commit()
    await db.refresh(db_redemption)

    return db_redemption

# Leaderboard Endpoint
@router.get("/leaderboard", response_model=List[LeaderboardEntry])
async def get_leaderboard(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get points leaderboard"""
    query = select(UserPoints, User).join(User, UserPoints.user_id == User.id).order_by(UserPoints.total_points.desc())
    query = query.offset(skip).limit(limit)

    result = await db.execute(query)
    rows = result.all()

    leaderboard = []
    for rank, (user_points, user) in enumerate(rows, start=skip + 1):
        entry = LeaderboardEntry(
            user_id=user.id,
            full_name=user.full_name,
            total_points=user_points.total_points,
            total_xp=user_points.total_xp,
            rank=rank,
            department_name=user.department.name if user.department else None
        )
        leaderboard.append(entry)

    return leaderboard

# Summary Stats
@router.get("/summary", response_model=RedemptionSummary)
async def get_redemption_summary(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Get redemption summary statistics (Admin only)"""
    # Count redemptions by status
    total_result = await db.execute(select(func.count(RewardRedemption.id)))
    total_count = total_result.scalar()

    pending_result = await db.execute(select(func.count(RewardRedemption.id)).where(RewardRedemption.status == RedemptionStatus.pending))
    pending_count = pending_result.scalar()

    approved_result = await db.execute(select(func.count(RewardRedemption.id)).where(RewardRedemption.status == RedemptionStatus.approved))
    approved_count = approved_result.scalar()

    rejected_result = await db.execute(select(func.count(RewardRedemption.id)).where(RewardRedemption.status == RedemptionStatus.rejected))
    rejected_count = rejected_result.scalar()

    fulfilled_result = await db.execute(select(func.count(RewardRedemption.id)).where(RewardRedemption.status == RedemptionStatus.fulfilled))
    fulfilled_count = fulfilled_result.scalar()

    # Calculate total redeemed points
    points_result = await db.execute(select(func.sum(RewardRedemption.points_used)).where(RewardRedemption.status.in_([RedemptionStatus.approved, RedemptionStatus.fulfilled])))
    points_redeemed = points_result.scalar() or 0

    return RedemptionSummary(
        total_redemptions=total_count,
        pending_redemptions=pending_count,
        approved_redemptions=approved_count,
        rejected_redemptions=rejected_count,
        fulfilled_redemptions=fulfilled_count,
        points_redeemed=points_redeemed
    )