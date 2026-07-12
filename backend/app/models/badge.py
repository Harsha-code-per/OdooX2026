from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Enum as SQLEnum, Text, Index, func, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from enum import Enum
import uuid
from app.database import Base

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

class Badge(Base):
    __tablename__ = "badges"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False, unique=True)
    description = Column(Text, nullable=False)
    icon = Column(String(255), nullable=True)  # Icon URL or emoji
    category = Column(SQLEnum(BadgeCategory), nullable=False)

    # Unlock criteria
    unlock_metric = Column(SQLEnum(BadgeUnlockMetric), nullable=False)
    unlock_threshold = Column(Integer, nullable=False, default=0)
    unlock_rule = Column(JSON, nullable=True)  # Complex unlock rules as JSON
    auto_award = Column(Boolean, nullable=False, default=False)  # Enable/disable auto-award

    # Points and rewards
    points_reward = Column(Integer, nullable=False, default=0)
    xp_reward = Column(Integer, nullable=False, default=0)

    # Availability
    is_active = Column(Boolean, nullable=False, default=True)
    is_limited = Column(Boolean, nullable=False, default=False)
    max_awards = Column(Integer, nullable=True)  # Limited edition badges
    total_awarded = Column(Integer, nullable=False, default=0)

    # Display
    display_order = Column(Integer, nullable=False, default=0)
    rarity = Column(String(20), nullable=False, default="common")  # 'common', 'rare', 'epic', 'legendary'

    # Requirements
    requirements = Column(Text, nullable=True)  # Human-readable requirements

    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationships
    user_badges = relationship("UserBadge", back_populates="badge", cascade="all, delete-orphan")
    unlock_rules = relationship("BadgeUnlockRule", back_populates="badge", cascade="all, delete-orphan")

    # Indexes
    __table_args__ = (
        Index('ix_badges_category', 'category'),
        Index('ix_badges_unlock_metric', 'unlock_metric'),
        Index('ix_badges_is_active', 'is_active'),
        Index('ix_badges_display_order', 'display_order'),
        Index('ix_badges_rarity', 'rarity'),
    )

    def __repr__(self):
        return f"<Badge(id={self.id}, name={self.name}, category={self.category})>"

class BadgeUnlockRule(Base):
    __tablename__ = "badge_unlock_rules"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    badge_id = Column(UUID(as_uuid=True), ForeignKey("badges.id"), nullable=False, index=True)

    # Rule definition
    rule_name = Column(String(100), nullable=False)
    metric_type = Column(String(50), nullable=False)  # Same as BadgeUnlockMetric
    threshold_value = Column(Integer, nullable=False, default=0)
    operator = Column(String(10), nullable=False, default=">=")  # '>=', '>', '=', '<=', '<'

    # Complex rules
    conditions = Column(JSON, nullable=True)  # For complex multi-condition rules
    time_period_days = Column(Integer, nullable=True)  # For time-based rules

    # Status
    is_active = Column(Boolean, nullable=False, default=True)
    priority = Column(Integer, nullable=False, default=0)  # Rule evaluation priority

    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationships
    badge = relationship("Badge", back_populates="unlock_rules")

    # Indexes
    __table_args__ = (
        Index('ix_badge_unlock_rules_badge_id', 'badge_id'),
        Index('ix_badge_unlock_rules_is_active', 'is_active'),
        Index('ix_badge_unlock_rules_priority', 'priority'),
    )

    def __repr__(self):
        return f"<BadgeUnlockRule(id={self.id}, badge_id={self.badge_id}, metric={self.metric_type})>"

class UserBadge(Base):
    __tablename__ = "user_badges"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    badge_id = Column(UUID(as_uuid=True), ForeignKey("badges.id"), nullable=False, index=True)

    # Award details
    awarded_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    awarded_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)  # Null if auto-awarded
    auto_awarded = Column(Boolean, nullable=False, default=False)

    # Progress (for in-progress badges)
    current_value = Column(Integer, nullable=False, default=0)
    target_value = Column(Integer, nullable=False, default=0)
    progress_percentage = Column(Integer, nullable=False, default=0)

    # Display
    is_displayed = Column(Boolean, nullable=False, default=True)  # Show on profile
    earned_date = Column(DateTime(timezone=True), nullable=True)  # When the badge was actually earned

    # Metadata
    award_metadata = Column(JSON, nullable=True)  # Additional context about the award

    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationships
    user = relationship("User", foreign_keys=[user_id], backref="badges")
    badge = relationship("Badge", back_populates="user_badges")
    awarder = relationship("User", foreign_keys=[awarded_by], backref="awarded_badges")

    # Indexes
    __table_args__ = (
        Index('ix_user_badges_user_id', 'user_id'),
        Index('ix_user_badges_badge_id', 'badge_id'),
        Index('ix_user_badges_awarded_at', 'awarded_at'),
        Index('ix_user_badges_auto_awarded', 'auto_awarded'),
        Index('ix_user_badges_user_badge', 'user_id', 'badge_id', unique=True),
    )

    def __repr__(self):
        return f"<UserBadge(id={self.id}, user_id={self.user_id}, badge_id={self.badge_id})>"

class BadgeProgress(Base):
    __tablename__ = "badge_progress"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    badge_id = Column(UUID(as_uuid=True), ForeignKey("badges.id"), nullable=False, index=True)

    # Progress tracking
    metric_type = Column(String(50), nullable=False)
    current_value = Column(Integer, nullable=False, default=0)
    target_value = Column(Integer, nullable=False, default=0)
    progress_percentage = Column(Integer, nullable=False, default=0)

    # Status
    is_unlocked = Column(Boolean, nullable=False, default=False)
    unlocked_at = Column(DateTime(timezone=True), nullable=True)

    # Engagement
    last_updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    streak_count = Column(Integer, nullable=False, default=0)  # For streak-based badges

    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationships
    user = relationship("User", backref="badge_progress")
    badge = relationship("Badge", backref="progress_records")

    # Indexes
    __table_args__ = (
        Index('ix_badge_progress_user_id', 'user_id'),
        Index('ix_badge_progress_badge_id', 'badge_id'),
        Index('ix_badge_progress_is_unlocked', 'is_unlocked'),
        Index('ix_badge_progress_user_badge', 'user_id', 'badge_id', unique=True),
    )

    def __repr__(self):
        return f"<BadgeProgress(id={self.id}, user_id={self.user_id}, badge_id={self.badge_id}, progress={self.progress_percentage}%)>"