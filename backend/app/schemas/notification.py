from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID
from enum import Enum

class NotificationType(str, Enum):
    compliance_issue = "compliance_issue"
    csr_approval = "csr_approval"
    challenge_approval = "challenge_approval"
    policy_acknowledgement = "policy_acknowledgement"
    badge_unlock = "badge_unlock"
    reward_redeemed = "reward_redeemed"
    new_challenge = "new_challenge"
    system_announcement = "system_announcement"

class NotificationPriority(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"
    urgent = "urgent"

class NotificationStatus(str, Enum):
    pending = "pending"
    sent = "sent"
    failed = "failed"
    read = "read"

# Notification Schemas
class NotificationBase(BaseModel):
    type: NotificationType
    priority: NotificationPriority = NotificationPriority.medium
    title: str = Field(..., min_length=1, max_length=255)
    message: str = Field(..., min_length=1)
    action_url: Optional[str] = Field(None, max_length=500)
    extra_data: Optional[Dict[str, Any]] = None

class NotificationCreate(NotificationBase):
    user_id: UUID

class NotificationUpdate(BaseModel):
    is_read: Optional[bool] = None
    status: Optional[NotificationStatus] = None

class NotificationResponse(NotificationBase):
    id: UUID
    user_id: UUID
    status: NotificationStatus
    is_read: bool
    read_at: Optional[datetime]
    sent_via_email: bool
    sent_via_app: bool
    email_sent_at: Optional[datetime]
    app_sent_at: Optional[datetime]
    error_message: Optional[str]
    retry_count: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Notification Preference Schemas
class NotificationPreferenceBase(BaseModel):
    enable_email_notifications: bool = True
    enable_app_notifications: bool = True
    enable_compliance_alerts: bool = True
    enable_csr_alerts: bool = True
    enable_challenge_alerts: bool = True
    enable_badge_alerts: bool = True
    enable_policy_reminders: bool = True
    enable_reward_alerts: bool = True
    email_digest_frequency: str = Field(default="immediate", description="immediate, daily, weekly")
    quiet_hours_start: Optional[str] = Field(None, pattern="^([01]?[0-9]|2[0-3]):[0-5][0-9]$", description="Format: HH:MM")
    quiet_hours_end: Optional[str] = Field(None, pattern="^([01]?[0-9]|2[0-3]):[0-5][0-9]$", description="Format: HH:MM")

class NotificationPreferenceCreate(NotificationPreferenceBase):
    user_id: UUID

class NotificationPreferenceUpdate(NotificationPreferenceBase):
    pass

class NotificationPreferenceResponse(NotificationPreferenceBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Notification Summary
class NotificationSummary(BaseModel):
    total_notifications: int
    unread_notifications: int
    pending_notifications: int
    failed_notifications: int
    high_priority_count: int
    urgent_count: int

# Batch Notification Operations
class BatchNotificationCreate(BaseModel):
    user_ids: List[UUID] = Field(..., min_items=1, max_items=100)
    notification: NotificationCreate

class NotificationMarkReadRequest(BaseModel):
    notification_ids: List[UUID] = Field(..., min_items=1)

class NotificationDeleteRequest(BaseModel):
    notification_ids: List[UUID] = Field(..., min_items=1)