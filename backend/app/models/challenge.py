from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Index, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from app.database import Base

class Challenge(Base):
    __tablename__ = "challenges"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), unique=True, nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(50), nullable=False)  # 'environmental', 'social', 'governance'
    difficulty = Column(String(20), nullable=False, default="medium")  # 'easy', 'medium', 'hard'
    xp_reward = Column(Integer, nullable=False, default=0)
    points_reward = Column(Integer, nullable=False, default=0)
    status = Column(String(20), nullable=False, default="draft")  # 'draft', 'active', 'completed', 'archived'
    deadline = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationships
    participations = relationship("ChallengeParticipation", back_populates="challenge", cascade="all, delete-orphan")

    # Indexes
    __table_args__ = (
        Index('ix_challenges_category', 'category'),
        Index('ix_challenges_status', 'status'),
    )

    def __repr__(self):
        return f"<Challenge(id={self.id}, title={self.title}, status={self.status})>"


class ChallengeParticipation(Base):
    __tablename__ = "challenge_participations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    challenge_id = Column(UUID(as_uuid=True), ForeignKey("challenges.id"), nullable=False, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    progress = Column(Integer, nullable=False, default=0)  # 0 to 100 percentage
    status = Column(String(20), nullable=False, default="in_progress")  # 'in_progress', 'submitted', 'completed', 'failed'
    proof_file = Column(String(500), nullable=True)
    points_awarded = Column(Integer, nullable=False, default=0)
    xp_awarded = Column(Integer, nullable=False, default=0)
    joined_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationships
    challenge = relationship("Challenge", back_populates="participations")
    user = relationship("User", backref="challenge_participations")

    # Indexes
    __table_args__ = (
        Index('ix_challenge_participations_user_challenge', 'user_id', 'challenge_id', unique=True),
        Index('ix_challenge_participations_status', 'status'),
    )

    def __repr__(self):
        return f"<ChallengeParticipation(id={self.id}, user_id={self.user_id}, status={self.status})>"
