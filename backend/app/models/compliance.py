from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Enum as SQLEnum, Text, Index, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from enum import Enum
import uuid
from app.database import Base

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

class ComplianceIssue(Base):
    __tablename__ = "compliance_issues"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # Basic information
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(SQLEnum(ComplianceIssueCategory), nullable=False)
    severity = Column(SQLEnum(ComplianceIssueSeverity), nullable=False, default=ComplianceIssueSeverity.medium)
    status = Column(SQLEnum(ComplianceIssueStatus), nullable=False, default=ComplianceIssueStatus.open)

    # Ownership and responsibility
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    department_id = Column(UUID(as_uuid=True), ForeignKey("departments.id"), nullable=True, index=True)
    assigned_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)

    # Due dates and timeline
    due_date = Column(DateTime(timezone=True), nullable=False, index=True)
    raised_date = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    resolved_date = Column(DateTime(timezone=True), nullable=True)
    closed_date = Column(DateTime(timezone=True), nullable=True)

    # Resolution details
    resolution_notes = Column(Text, nullable=True)
    resolution_method = Column(String(100), nullable=True)

    # Impact assessment
    risk_level = Column(String(20), nullable=True)  # 'high', 'medium', 'low'
    impact_description = Column(Text, nullable=True)
    affected_stakeholders = Column(Text, nullable=True)  # JSON array of stakeholder IDs

    # Source and reference
    source = Column(String(50), nullable=True)  # 'audit', 'self_assessment', 'whistleblower', 'regulatory', etc.
    source_reference = Column(String(255), nullable=True)  # External reference number
    related_policy_id = Column(UUID(as_uuid=True), nullable=True)  # Link to related policy if applicable

    # Verification and approval
    verified_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    verified_at = Column(DateTime(timezone=True), nullable=True)

    # Overdue tracking
    is_overdue = Column(Boolean, nullable=False, default=False, index=True)
    overdue_days = Column(Integer, nullable=False, default=0)
    last_overdue_check = Column(DateTime(timezone=True), nullable=True)

    # Notifications
    overdue_notification_sent = Column(Boolean, nullable=False, default=False)
    upcoming_due_date_sent = Column(Boolean, nullable=False, default=False)

    # Priority and escalation
    priority = Column(Integer, nullable=False, default=3)  # 1-5, where 5 is highest
    escalation_level = Column(Integer, nullable=False, default=0)  # 0=none, 1=manager, 2=director, etc.
    escalated_to = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    escalated_at = Column(DateTime(timezone=True), nullable=True)

    # Audit trail
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    updated_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)

    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationships
    owner = relationship("User", foreign_keys=[owner_id], backref="owned_compliance_issues")
    assigner = relationship("User", foreign_keys=[assigned_by], backref="assigned_compliance_issues")
    creator = relationship("User", foreign_keys=[created_by], backref="created_compliance_issues")
    updater = relationship("User", foreign_keys=[updated_by], backref="updated_compliance_issues")
    verifier = relationship("User", foreign_keys=[verified_by], backref="verified_compliance_issues")
    escalatee = relationship("User", foreign_keys=[escalated_to], backref="escalated_compliance_issues")
    department = relationship("Department", backref="compliance_issues")
    comments = relationship("ComplianceIssueComment", back_populates="compliance_issue", cascade="all, delete-orphan")
    attachments = relationship("ComplianceIssueAttachment", back_populates="compliance_issue", cascade="all, delete-orphan")

    # Indexes
    __table_args__ = (
        Index('ix_compliance_issues_owner_id', 'owner_id'),
        Index('ix_compliance_issues_department_id', 'department_id'),
        Index('ix_compliance_issues_category', 'category'),
        Index('ix_compliance_issues_severity', 'severity'),
        Index('ix_compliance_issues_status', 'status'),
        Index('ix_compliance_issues_due_date', 'due_date'),
        Index('ix_compliance_issues_is_overdue', 'is_overdue'),
        Index('ix_compliance_issues_priority', 'priority'),
        Index('ix_compliance_issues_created_by', 'created_by'),
        Index('ix_compliance_issues_raised_date', 'raised_date'),
    )

    def __repr__(self):
        return f"<ComplianceIssue(id={self.id}, title={self.title}, status={self.status}, severity={self.severity})>"

class ComplianceIssueComment(Base):
    __tablename__ = "compliance_issue_comments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    compliance_issue_id = Column(UUID(as_uuid=True), ForeignKey("compliance_issues.id"), nullable=False, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)

    # Comment details
    comment = Column(Text, nullable=False)
    comment_type = Column(String(20), nullable=False, default="update")  # 'update', 'question', 'concern', 'resolution'

    # Status change
    previous_status = Column(String(20), nullable=True)
    new_status = Column(String(20), nullable=True)

    # Visibility
    is_internal = Column(Boolean, nullable=False, default=False)  # Internal comments not visible to external parties

    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationships
    compliance_issue = relationship("ComplianceIssue", back_populates="comments")
    user = relationship("User", backref="compliance_comments")

    # Indexes
    __table_args__ = (
        Index('ix_compliance_issue_comments_compliance_issue_id', 'compliance_issue_id'),
        Index('ix_compliance_issue_comments_user_id', 'user_id'),
        Index('ix_compliance_issue_comments_is_internal', 'is_internal'),
        Index('ix_compliance_issue_comments_created_at', 'created_at'),
    )

    def __repr__(self):
        return f"<ComplianceIssueComment(id={self.id}, compliance_issue_id={self.compliance_issue_id}, user_id={self.user_id})>"

class ComplianceIssueAttachment(Base):
    __tablename__ = "compliance_issue_attachments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    compliance_issue_id = Column(UUID(as_uuid=True), ForeignKey("compliance_issues.id"), nullable=False, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)

    # File details
    file_name = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)  # Storage path or URL
    file_size = Column(Integer, nullable=False)  # Size in bytes
    file_type = Column(String(100), nullable=False)  # MIME type
    file_extension = Column(String(10), nullable=False)

    # Description
    description = Column(Text, nullable=True)
    attachment_type = Column(String(50), nullable=False, default="evidence")  # 'evidence', 'report', 'correspondence', 'other'

    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())

    # Relationships
    compliance_issue = relationship("ComplianceIssue", back_populates="attachments")
    user = relationship("User", backref="compliance_attachments")

    # Indexes
    __table_args__ = (
        Index('ix_compliance_issue_attachments_compliance_issue_id', 'compliance_issue_id'),
        Index('ix_compliance_issue_attachments_user_id', 'user_id'),
        Index('ix_compliance_issue_attachments_attachment_type', 'attachment_type'),
    )

    def __repr__(self):
        return f"<ComplianceIssueAttachment(id={self.id}, file_name={self.file_name}, compliance_issue_id={self.compliance_issue_id})>"