from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from uuid import UUID
from enum import Enum

class CSRActivityType(str, Enum):
    volunteer = "volunteer"
    donation = "donation"
    community = "community"
    environmental = "environmental"
    educational = "educational"
    health = "health"
    disaster_relief = "disaster_relief"
    other = "other"

class CSRActivityStatus(str, Enum):
    draft = "draft"
    submitted = "submitted"
    under_review = "under_review"
    approved = "approved"
    rejected = "rejected"
    completed = "completed"

# CSR Activity Schemas
class CSRActivityBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: str = Field(..., min_length=1)
    activity_type: CSRActivityType
    activity_date: datetime
    hours_spent: Optional[int] = Field(None, ge=0)
    beneficiaries_count: Optional[int] = Field(None, ge=0)
    amount_donated: Optional[int] = Field(None, ge=0)
    carbon_impact_kg: Optional[int] = Field(None, ge=0)
    points_earned: int = Field(..., ge=0, default=0)
    xp_earned: int = Field(..., ge=0, default=0)
    evidence_required: bool = False
    challenge_id: Optional[UUID] = None

class CSRActivityCreate(CSRActivityBase):
    user_id: UUID
    department_id: Optional[UUID] = None

class CSRActivityUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, min_length=1)
    activity_type: Optional[CSRActivityType] = None
    activity_date: Optional[datetime] = None
    hours_spent: Optional[int] = Field(None, ge=0)
    beneficiaries_count: Optional[int] = Field(None, ge=0)
    amount_donated: Optional[int] = Field(None, ge=0)
    carbon_impact_kg: Optional[int] = Field(None, ge=0)
    status: Optional[CSRActivityStatus] = None
    points_earned: Optional[int] = Field(None, ge=0)
    xp_earned: Optional[int] = Field(None, ge=0)
    evidence_required: Optional[bool] = None
    evidence_provided: Optional[bool] = None
    approval_notes: Optional[str] = None

class CSRActivityResponse(CSRActivityBase):
    id: UUID
    user_id: UUID
    department_id: Optional[UUID]
    status: CSRActivityStatus
    submitted_at: Optional[datetime]
    reviewed_by: Optional[UUID]
    reviewed_at: Optional[datetime]
    approval_notes: Optional[str]
    evidence_provided: bool
    evidence_file_count: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Evidence Document Schemas
class EvidenceDocumentBase(BaseModel):
    file_name: str = Field(..., min_length=1, max_length=255)
    file_path: str = Field(..., min_length=1, max_length=500)
    file_size: int = Field(..., gt=0)
    file_type: str = Field(..., min_length=1, max_length=100)
    file_extension: str = Field(..., min_length=1, max_length=10)

class EvidenceDocumentCreate(EvidenceDocumentBase):
    csr_activity_id: UUID
    user_id: UUID

class EvidenceDocumentUpdate(BaseModel):
    is_verified: Optional[bool] = None
    verification_notes: Optional[str] = None

class EvidenceDocumentResponse(EvidenceDocumentBase):
    id: UUID
    csr_activity_id: UUID
    user_id: UUID
    is_verified: bool
    verified_by: Optional[UUID]
    verified_at: Optional[datetime]
    verification_notes: Optional[str]
    uploaded_at: datetime
    upload_ip: Optional[str]
    upload_source: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# CSR Activity Approval Request
class CSRActivityApprovalRequest(BaseModel):
    activity_id: UUID
    approve: bool = Field(..., description="True to approve, False to reject")
    approval_notes: Optional[str] = Field(None, max_length=1000)
    points_override: Optional[int] = Field(None, ge=0)
    xp_override: Optional[int] = Field(None, ge=0)

# Evidence Upload Request
class EvidenceUploadRequest(BaseModel):
    csr_activity_id: UUID
    file_name: str = Field(..., min_length=1, max_length=255)
    file_type: str = Field(..., min_length=1, max_length=100)

# CSR Summary Stats
class CSRSummaryStats(BaseModel):
    total_activities: int
    approved_activities: int
    pending_activities: int
    total_volunteer_hours: int
    total_beneficiaries: int
    total_donations: int
    total_carbon_impact: int
    total_points_earned: int
    total_xp_earned: int

# CSR Activity List Response
class CSRActivityListResponse(BaseModel):
    activities: List[CSRActivityResponse]
    total_count: int
    page: int
    page_size: int
    has_more: bool