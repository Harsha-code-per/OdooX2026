from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID
from enum import Enum

class BadgeCategory(str, Enum):
    environmental = "environmental"
    social = "social"
    governance = "governance"
    leadership = "leadership"
    innovation = "innovation"
    community = "community"
    milestone = "milestone"

class BadgeUnlockMetric(str, Enum):
    total_xp = "total_xp"
    completed_challenges = "completed_challenges"
    csr_activities = "csr_activities"
    volunteer_hours = "volunteer_hours"
    carbon_reduction = "carbon_reduction"
    streak_days = "streak_days"
    team_contributions = "team_contributions"
    policy_acknowledgements = "policy_acknowledgements"
    custom = "custom"

# Badge Schemas
class BadgeBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: str = Field(..., min_length=1)
    icon: Optional[str] = Field(None, max_length=255)
    category: BadgeCategory
    unlock_metric: BadgeUnlockMetric
    unlock_threshold: int = Field(..., ge=0)
    unlock_rule: Optional[Dict[str, Any]] = None
    auto_award: bool = False
    points_reward: int = Field(default=0, ge=0)
    xp_reward: int = Field(default=0, ge=0)
    is_active: bool = True
    is_limited: bool = False
    max_awards: Optional[int] = Field(None, ge=1)
    display_order: int = 0
    rarity: str = Field(default="common", pattern="^(common|rare|epic|legendary)$")
    requirements: Optional[str] = None

class BadgeCreate(BadgeBase):
    pass

class BadgeUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, min_length=1)
    icon: Optional[str] = Field(None, max_length=255)
    category: Optional[BadgeCategory] = None
    unlock_metric: Optional[BadgeUnlockMetric] = None
    unlock_threshold: Optional[int] = Field(None, ge=0)
    unlock_rule: Optional[Dict[str, Any]] = None
    auto_award: Optional[bool] = None
    points_reward: Optional[int] = Field(None, ge=0)
    xp_reward: Optional[int] = Field(None, ge=0)
    is_active: Optional[bool] = None
    is_limited: Optional[bool] = None
    max_awards: Optional[int] = Field(None, ge=1)
    display_order: Optional[int] = None
    rarity: Optional[str] = Field(None, pattern="^(common|rare|epic|legendary)$")
    requirements: Optional[str] = None

class BadgeResponse(BadgeBase):
    id: UUID
    total_awarded: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Badge Unlock Rule Schemas
class BadgeUnlockRuleBase(BaseModel):
    rule_name: str = Field(..., min_length=1, max_length=100)
    metric_type: str = Field(..., min_length=1, max_length=50)
    threshold_value: int = Field(..., ge=0)
    operator: str = Field(default=">=", pattern="^(>=|>|=|<=|<)$")
    conditions: Optional[Dict[str, Any]] = None
    time_period_days: Optional[int] = Field(None, ge=1)
    is_active: bool = True
    priority: int = 0

class BadgeUnlockRuleCreate(BadgeUnlockRuleBase):
    badge_id: UUID

class BadgeUnlockRuleUpdate(BaseModel):
    rule_name: Optional[str] = Field(None, min_length=1, max_length=100)
    metric_type: Optional[str] = Field(None, min_length=1, max_length=50)
    threshold_value: Optional[int] = Field(None, ge=0)
    operator: Optional[str] = Field(None, pattern="^(>=|>|=|<=|<)$")
    conditions: Optional[Dict[str, Any]] = None
    time_period_days: Optional[int] = Field(None, ge=1)
    is_active: Optional[bool] = None
    priority: Optional[int] = None

class BadgeUnlockRuleResponse(BadgeUnlockRuleBase):
    id: UUID
    badge_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# User Badge Schemas
class UserBadgeBase(BaseModel):
    user_id: UUID
    badge_id: UUID
    awarded_by: Optional[UUID] = None
    auto_awarded: bool = False
    is_displayed: bool = True
    current_value: int = 0
    target_value: int = 0
    progress_percentage: int = Field(..., ge=0, le=100)

class UserBadgeCreate(UserBadgeBase):
    pass

class UserBadgeUpdate(BaseModel):
    is_displayed: Optional[bool] = None
    current_value: Optional[int] = Field(None, ge=0)
    target_value: Optional[int] = Field(None, ge=0)
    progress_percentage: Optional[int] = Field(None, ge=0, le=100)

class UserBadgeResponse(UserBadgeBase):
    id: UUID
    awarded_at: datetime
    earned_date: Optional[datetime]
    award_metadata: Optional[Dict[str, Any]]
    created_at: datetime
    updated_at: datetime

    # Nested badge info
    badge: Optional[BadgeResponse] = None

    class Config:
        from_attributes = True

# Badge Progress Schemas
class BadgeProgressBase(BaseModel):
    user_id: UUID
    badge_id: UUID
    metric_type: str = Field(..., min_length=1, max_length=50)
    current_value: int = Field(..., ge=0)
    target_value: int = Field(..., ge=0)
    progress_percentage: int = Field(..., ge=0, le=100)

class BadgeProgressCreate(BadgeProgressBase):
    pass

class BadgeProgressUpdate(BaseModel):
    current_value: Optional[int] = Field(None, ge=0)
    target_value: Optional[int] = Field(None, ge=0)
    progress_percentage: Optional[int] = Field(None, ge=0, le=100)
    is_unlocked: Optional[bool] = None

class BadgeProgressResponse(BadgeProgressBase):
    id: UUID
    is_unlocked: bool
    unlocked_at: Optional[datetime]
    last_updated_at: datetime
    streak_count: int
    created_at: datetime
    updated_at: datetime

    # Nested badge info
    badge: Optional[BadgeResponse] = None

    class Config:
        from_attributes = True

# Badge Award Request
class BadgeAwardRequest(BaseModel):
    user_id: UUID
    badge_id: UUID
    awarded_by: Optional[UUID] = None
    auto_awarded: bool = False
    award_metadata: Optional[Dict[str, Any]] = None

# Auto-Award Result
class BadgeAutoAwardResult(BaseModel):
    success: bool
    awarded_count: int
    skipped_count: int
    failed_count: int
    awarded_badges: List[UserBadgeResponse] = []
    errors: List[str] = []

# Badge User Stats
class BadgeUserStats(BaseModel):
    user_id: UUID
    total_badges: int
    unlocked_badges: int
    in_progress_badges: int
    locked_badges: int
    latest_badges: List[BadgeResponse] = []
    rarest_badges: List[BadgeResponse] = []