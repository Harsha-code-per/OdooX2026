from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import datetime
from uuid import UUID
from enum import Enum

class RewardCategory(str, Enum):
    merchandise = "merchandise"
    gift_card = "gift_card"
    experience = "experience"
    donation = "donation"
    time_off = "time_off"

class RewardStatus(str, Enum):
    available = "available"
    out_of_stock = "out_of_stock"
    discontinued = "discontinued"

class RedemptionStatus(str, Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"
    fulfilled = "fulfilled"
    cancelled = "cancelled"

# Reward Schemas
class RewardBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    category: RewardCategory = RewardCategory.merchandise
    points_required: int = Field(..., ge=0, description="Points required to redeem")
    image_url: Optional[str] = Field(None, max_length=500)
    stock_quantity: int = Field(..., ge=0, description="Available stock quantity")

class RewardCreate(RewardBase):
    pass

class RewardUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    category: Optional[RewardCategory] = None
    points_required: Optional[int] = Field(None, ge=0)
    image_url: Optional[str] = Field(None, max_length=500)
    stock_quantity: Optional[int] = Field(None, ge=0)
    status: Optional[RewardStatus] = None

class RewardResponse(RewardBase):
    id: UUID
    status: RewardStatus
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Reward Redemption Schemas
class RewardRedemptionBase(BaseModel):
    reward_id: UUID
    notes: Optional[str] = Field(None, max_length=1000)

class RewardRedemptionCreate(RewardRedemptionBase):
    pass

class RewardRedemptionUpdate(BaseModel):
    status: RedemptionStatus
    notes: Optional[str] = Field(None, max_length=1000)

class RewardRedemptionResponse(BaseModel):
    id: UUID
    user_id: UUID
    reward_id: UUID
    points_used: int
    status: RedemptionStatus
    notes: Optional[str]
    processed_by: Optional[UUID]
    processed_at: Optional[datetime]
    fulfilled_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime

    # Nested reward info
    reward: Optional[RewardResponse] = None

    class Config:
        from_attributes = True

# User Points Schemas
class UserPointsBase(BaseModel):
    total_points: int = Field(..., ge=0)
    total_xp: int = Field(..., ge=0)
    available_points: int = Field(..., ge=0)
    redeemed_points: int = Field(..., ge=0)

class UserPointsResponse(UserPointsBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Points Transaction Schemas
class PointsTransactionBase(BaseModel):
    points: int = Field(..., description="Can be positive (earned) or negative (redeemed)")
    xp: int = Field(..., ge=0, default=0)
    transaction_type: str = Field(..., description="earned, redeemed, bonus, penalty")
    source: Optional[str] = Field(None, max_length=100, description="Source of points: challenge, csr, training, manual, etc.")
    source_id: Optional[UUID] = Field(None, description="Reference to source entity")
    description: Optional[str] = Field(None, max_length=500)

class PointsTransactionCreate(PointsTransactionBase):
    user_id: UUID

class PointsTransactionResponse(PointsTransactionBase):
    id: UUID
    user_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

# Leaderboard Schema
class LeaderboardEntry(BaseModel):
    user_id: UUID
    full_name: str
    total_points: int
    total_xp: int
    rank: int
    department_name: Optional[str] = None

# Redemption Summary
class RedemptionSummary(BaseModel):
    total_redemptions: int
    pending_redemptions: int
    approved_redemptions: int
    rejected_redemptions: int
    fulfilled_redemptions: int
    points_redeemed: int