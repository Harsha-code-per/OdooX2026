from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Enum as SQLEnum, Text, Index, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from enum import Enum
import uuid
from app.database import Base

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

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    type = Column(SQLEnum(NotificationType), nullable=False)
    priority = Column(SQLEnum(NotificationPriority), nullable=False, default=NotificationPriority.medium)
    status = Column(SQLEnum(NotificationStatus), nullable=False, default=NotificationStatus.pending)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    action_url = Column(String(500), nullable=True)
    is_read = Column(Boolean, nullable=False, default=False)
    read_at = Column(DateTime(timezone=True), nullable=True)
    sent_via_email = Column(Boolean, nullable=False, default=False)
    sent_via_app = Column(Boolean, nullable=False, default=False)
    email_sent_at = Column(DateTime(timezone=True), nullable=True)
    app_sent_at = Column(DateTime(timezone=True), nullable=True)
    error_message = Column(Text, nullable=True)
    retry_count = Column(Integer, nullable=False, default=0)
    extra_data = Column(Text, nullable=True)  # JSON for additional context
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationships
    user = relationship("User", backref="notifications")

    # Indexes
    __table_args__ = (
        Index('ix_notifications_user_id', 'user_id'),
        Index('ix_notifications_type', 'type'),
        Index('ix_notifications_status', 'status'),
        Index('ix_notifications_is_read', 'is_read'),
        Index('ix_notifications_created_at', 'created_at'),
        Index('ix_notifications_user_status', 'user_id', 'status'),
    )

    def __repr__(self):
        return f"<Notification(id={self.id}, user_id={self.user_id}, type={self.type})>"

class NotificationPreference(Base):
    __tablename__ = "notification_preferences"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, unique=True, index=True)
    enable_email_notifications = Column(Boolean, nullable=False, default=True)
    enable_app_notifications = Column(Boolean, nullable=False, default=True)
    enable_compliance_alerts = Column(Boolean, nullable=False, default=True)
    enable_csr_alerts = Column(Boolean, nullable=False, default=True)
    enable_challenge_alerts = Column(Boolean, nullable=False, default=True)
    enable_badge_alerts = Column(Boolean, nullable=False, default=True)
    enable_policy_reminders = Column(Boolean, nullable=False, default=True)
    enable_reward_alerts = Column(Boolean, nullable=False, default=True)
    email_digest_frequency = Column(String(20), nullable=False, default="immediate")  # 'immediate', 'daily', 'weekly'
    quiet_hours_start = Column(String(5), nullable=True)  # '22:00' format
    quiet_hours_end = Column(String(5), nullable=True)    # '08:00' format
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationships
    user = relationship("User", backref="notification_preferences")

    # Indexes
    __table_args__ = (
        Index('ix_notification_preferences_user_id', 'user_id'),
    )

    def __repr__(self):
        return f"<NotificationPreference(user_id={self.user_id}, email_enabled={self.enable_email_notifications})>"