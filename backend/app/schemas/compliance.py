from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID
from enum import Enum

class ComplianceIssueCategory(str, Enum):
    environmental = "environmental"
    social = "social"
    governance = "governance"
    data_privacy = "data_privacy"
    health_safety = "health_safety"
    financial = "financial"
    operational = "operational"
    legal = "legal"
    other = "other"

class ComplianceIssueSeverity(str, Enum):
    critical = "critical"
    high = "high"
    medium = "medium"
    low = "low"
    informational = "informational"

class ComplianceIssueStatus(str, Enum):
    open = "open"
    in_progress = "in_progress"
    under_review = "under_review"
    resolved = "resolved"
    closed = "closed"
    reopened = "reopened"

# Compliance Issue Schemas
class ComplianceIssueBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: str = Field(..., min_length=1)
    category: ComplianceIssueCategory
    severity: ComplianceIssueSeverity = ComplianceIssueSeverity.medium
    due_date: datetime
    risk_level: Optional[str] = Field(None, pattern="^(high|medium|low)$")
    impact_description: Optional[str] = None
    affected_stakeholders: Optional[List[str]] = None
    source: Optional[str] = Field(None, max_length=50)
    source_reference: Optional[str] = Field(None, max_length=255)
    priority: int = Field(default=3, ge=1, le=5)

class ComplianceIssueCreate(ComplianceIssueBase):
    owner_id: UUID
    department_id: Optional[UUID] = None
    assigned_by: Optional[UUID] = None
    related_policy_id: Optional[UUID] = None

class ComplianceIssueUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, min_length=1)
    category: Optional[ComplianceIssueCategory] = None
    severity: Optional[ComplianceIssueSeverity] = None
    status: Optional[ComplianceIssueStatus] = None
    owner_id: Optional[UUID] = None
    department_id: Optional[UUID] = None
    due_date: Optional[datetime] = None
    risk_level: Optional[str] = Field(None, pattern="^(high|medium|low)$")
    impact_description: Optional[str] = None
    affected_stakeholders: Optional[List[str]] = None
    priority: Optional[int] = Field(None, ge=1, le=5)
    resolution_notes: Optional[str] = None
    resolution_method: Optional[str] = Field(None, max_length=100)

class ComplianceIssueResponse(ComplianceIssueBase):
    id: UUID
    status: ComplianceIssueStatus
    owner_id: UUID
    department_id: Optional[UUID]
    assigned_by: Optional[UUID]
    raised_date: datetime
    resolved_date: Optional[datetime]
    closed_date: Optional[datetime]
    resolution_notes: Optional[str]
    resolution_method: Optional[str]
    verified_by: Optional[UUID]
    verified_at: Optional[datetime]
    is_overdue: bool
    overdue_days: int
    overdue_notification_sent: bool
    upcoming_due_date_sent: bool
    escalation_level: int
    escalated_to: Optional[UUID]
    escalated_at: Optional[datetime]
    created_by: UUID
    updated_by: Optional[UUID]
    created_at: datetime
    updated_at: datetime

    # Nested relationships
    owner: Optional[Dict[str, Any]] = None
    department: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True

# Compliance Issue Comment Schemas
class ComplianceIssueCommentBase(BaseModel):
    comment: str = Field(..., min_length=1)
    comment_type: str = Field(default="update", pattern="^(update|question|concern|resolution)$")
    is_internal: bool = False

class ComplianceIssueCommentCreate(ComplianceIssueCommentBase):
    compliance_issue_id: UUID
    user_id: UUID

class ComplianceIssueCommentResponse(ComplianceIssueCommentBase):
    id: UUID
    compliance_issue_id: UUID
    user_id: UUID
    previous_status: Optional[str]
    new_status: Optional[str]
    created_at: datetime
    updated_at: datetime

    # Nested user info
    user: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True

# Compliance Issue Attachment Schemas
class ComplianceIssueAttachmentBase(BaseModel):
    file_name: str = Field(..., min_length=1, max_length=255)
    file_path: str = Field(..., min_length=1, max_length=500)
    file_size: int = Field(..., gt=0)
    file_type: str = Field(..., min_length=1, max_length=100)
    file_extension: str = Field(..., min_length=1, max_length=10)
    description: Optional[str] = None
    attachment_type: str = Field(default="evidence", pattern="^(evidence|report|correspondence|other)$")

class ComplianceIssueAttachmentCreate(ComplianceIssueAttachmentBase):
    compliance_issue_id: UUID
    user_id: UUID

class ComplianceIssueAttachmentResponse(ComplianceIssueAttachmentBase):
    id: UUID
    compliance_issue_id: UUID
    user_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

# Compliance Issue Assignment
class ComplianceIssueAssignment(BaseModel):
    issue_id: UUID
    new_owner_id: UUID
    assigned_by: UUID
    notes: Optional[str] = None

# Compliance Issue Escalation
class ComplianceIssueEscalation(BaseModel):
    issue_id: UUID
    escalate_to: UUID
    escalation_level: int = Field(..., ge=1)
    escalated_by: UUID
    notes: Optional[str] = None

# Overdue Check Response
class ComplianceOverdueCheck(BaseModel):
    overdue_count: int
    upcoming_due_count: int
    overdue_issues: List[ComplianceIssueResponse] = []
    upcoming_issues: List[ComplianceIssueResponse] = []

# Compliance Summary Stats
class ComplianceSummaryStats(BaseModel):
    total_issues: int
    open_issues: int
    in_progress_issues: int
    resolved_issues: int
    closed_issues: int
    overdue_issues: int
    critical_issues: int
    high_priority_issues: int
    average_resolution_time_hours: Optional[float] = None
    issues_by_category: Dict[str, int] = {}
    issues_by_severity: Dict[str, int] = {}