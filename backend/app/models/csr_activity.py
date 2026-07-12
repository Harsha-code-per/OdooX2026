from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Enum as SQLEnum, Text, Index, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from enum import Enum
import uuid
from app.database import Base

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

class CSRActivity(Base):
    __tablename__ = "csr_activities"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    department_id = Column(UUID(as_uuid=True), ForeignKey("departments.id"), nullable=True, index=True)
    challenge_id = Column(UUID(as_uuid=True), nullable=True, index=True)  # Link to challenge if applicable

    # Activity details
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    activity_type = Column(SQLEnum(CSRActivityType), nullable=False)
    activity_date = Column(DateTime(timezone=True), nullable=False)

    # Impact measurement
    hours_spent = Column(Integer, nullable=True)
    beneficiaries_count = Column(Integer, nullable=True)
    amount_donated = Column(Integer, nullable=True)  # In currency units
    carbon_impact_kg = Column(Integer, nullable=True)  # Environmental impact

    # Points and rewards
    points_earned = Column(Integer, nullable=False, default=0)
    xp_earned = Column(Integer, nullable=False, default=0)

    # Approval workflow
    status = Column(SQLEnum(CSRActivityStatus), nullable=False, default=CSRActivityStatus.draft)
    submitted_at = Column(DateTime(timezone=True), nullable=True)
    reviewed_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    reviewed_at = Column(DateTime(timezone=True), nullable=True)
    approval_notes = Column(Text, nullable=True)

    # Evidence requirement
    evidence_required = Column(Boolean, nullable=False, default=False)
    evidence_provided = Column(Boolean, nullable=False, default=False)
    evidence_file_count = Column(Integer, nullable=False, default=0)

    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationships
    user = relationship("User", foreign_keys=[user_id], backref="csr_activities")
    reviewer = relationship("User", foreign_keys=[reviewed_by], backref="reviewed_csr_activities")
    department = relationship("Department", backref="csr_activities")
    evidence_documents = relationship("EvidenceDocument", back_populates="csr_activity", cascade="all, delete-orphan")

    # Indexes
    __table_args__ = (
        Index('ix_csr_activities_user_id', 'user_id'),
        Index('ix_csr_activities_department_id', 'department_id'),
        Index('ix_csr_activities_challenge_id', 'challenge_id'),
        Index('ix_csr_activities_activity_type', 'activity_type'),
        Index('ix_csr_activities_status', 'status'),
        Index('ix_csr_activities_activity_date', 'activity_date'),
        Index('ix_csr_activities_evidence_provided', 'evidence_provided'),
    )

    def __repr__(self):
        return f"<CSRActivity(id={self.id}, title={self.title}, type={self.activity_type})>"

class EvidenceDocument(Base):
    __tablename__ = "evidence_documents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    csr_activity_id = Column(UUID(as_uuid=True), ForeignKey("csr_activities.id"), nullable=False, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)

    # File details
    file_name = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)  # Storage path or URL
    file_size = Column(Integer, nullable=False)  # Size in bytes
    file_type = Column(String(100), nullable=False)  # MIME type
    file_extension = Column(String(10), nullable=False)

    # Verification
    is_verified = Column(Boolean, nullable=False, default=False)
    verified_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    verified_at = Column(DateTime(timezone=True), nullable=True)
    verification_notes = Column(Text, nullable=True)

    # Upload metadata
    uploaded_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    upload_ip = Column(String(45), nullable=True)  # IPv6 support
    upload_source = Column(String(100), nullable=True)  # 'web', 'mobile', 'api'

    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationships
    csr_activity = relationship("CSRActivity", back_populates="evidence_documents")
    user = relationship("User", foreign_keys=[user_id], backref="uploaded_evidence")
    verifier = relationship("User", foreign_keys=[verified_by], backref="verified_evidence")

    # Indexes
    __table_args__ = (
        Index('ix_evidence_documents_csr_activity_id', 'csr_activity_id'),
        Index('ix_evidence_documents_user_id', 'user_id'),
        Index('ix_evidence_documents_is_verified', 'is_verified'),
        Index('ix_evidence_documents_uploaded_at', 'uploaded_at'),
    )

    def __repr__(self):
        return f"<EvidenceDocument(id={self.id}, file_name={self.file_name}, csr_activity_id={self.csr_activity_id})>"