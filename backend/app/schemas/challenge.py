from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from uuid import UUID

class ChallengeBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: str = Field(..., min_length=1)
    category: str = Field(..., min_length=1, max_length=50)  # 'environmental', 'social', 'governance'
    difficulty: str = Field(default="medium", pattern="^(easy|medium|hard)$")
    xp_reward: int = Field(default=0, ge=0)
    points_reward: int = Field(default=0, ge=0)
    status: str = Field(default="draft", pattern="^(draft|active|completed|archived)$")
    deadline: Optional[datetime] = None

class ChallengeCreate(ChallengeBase):
    pass

class ChallengeUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, min_length=1)
    category: Optional[str] = Field(None, min_length=1, max_length=50)
    difficulty: Optional[str] = Field(None, pattern="^(easy|medium|hard)$")
    xp_reward: Optional[int] = Field(None, ge=0)
    points_reward: Optional[int] = Field(None, ge=0)
    status: Optional[str] = Field(None, pattern="^(draft|active|completed|archived)$")
    deadline: Optional[datetime] = None

class ChallengeResponse(ChallengeBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ChallengeParticipationBase(BaseModel):
    challenge_id: UUID
    progress: int = Field(default=0, ge=0, le=100)
    status: str = Field(default="in_progress", pattern="^(in_progress|submitted|completed|failed)$")
    proof_file: Optional[str] = None
    points_awarded: int = Field(default=0, ge=0)
    xp_awarded: int = Field(default=0, ge=0)

class ChallengeParticipationResponse(ChallengeParticipationBase):
    id: UUID
    user_id: UUID
    joined_at: datetime
    completed_at: Optional[datetime] = None
    challenge: Optional[ChallengeResponse] = None

    class Config:
        from_attributes = True

class ChallengeJoinRequest(BaseModel):
    pass

class ChallengeProgressUpdateRequest(BaseModel):
    progress: int = Field(..., ge=0, le=100)
    status: str = Field(..., pattern="^(in_progress|submitted|completed|failed)$")
    proof_file: Optional[str] = None
