from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Enum as SQLEnum, Numeric, Index, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from enum import Enum
import uuid
from app.database import Base

class RewardStatus(str, Enum):
    available = "available"
    out_of_stock = "out_of_stock"
    discontinued = "discontinued"

class RewardCategory(str, Enum):
    merchandise = "merchandise"
    gift_card = "gift_card"
    experience = "experience"
    donation = "donation"
    time_off = "time_off"

class Reward(Base):
    __tablename__ = "rewards"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    description = Column(String(1000), nullable=True)
    category = Column(SQLEnum(RewardCategory), nullable=False, default=RewardCategory.merchandise)
    points_required = Column(Integer, nullable=False, default=0)
    image_url = Column(String(500), nullable=True)
    stock_quantity = Column(Integer, nullable=False, default=0)
    status = Column(SQLEnum(RewardStatus), nullable=False, default=RewardStatus.available)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationships
    redemptions = relationship("RewardRedemption", back_populates="reward", cascade="all, delete-orphan")

    # Indexes
    __table_args__ = (
        Index('ix_rewards_category', 'category'),
        Index('ix_rewards_status', 'status'),
        Index('ix_rewards_points_required', 'points_required'),
    )

    def __repr__(self):
        return f"<Reward(id={self.id}, name={self.name}, points={self.points_required})>"

class RedemptionStatus(str, Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"
    fulfilled = "fulfilled"
    cancelled = "cancelled"

class RewardRedemption(Base):
    __tablename__ = "reward_redemptions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    reward_id = Column(UUID(as_uuid=True), ForeignKey("rewards.id"), nullable=False, index=True)
    points_used = Column(Integer, nullable=False)
    status = Column(SQLEnum(RedemptionStatus), nullable=False, default=RedemptionStatus.pending)
    notes = Column(String(1000), nullable=True)
    processed_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    processed_at = Column(DateTime(timezone=True), nullable=True)
    fulfilled_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationships
    user = relationship("User", foreign_keys=[user_id], backref="reward_redemptions")
    reward = relationship("Reward", back_populates="redemptions")
    processor = relationship("User", foreign_keys=[processed_by])

    # Indexes
    __table_args__ = (
        Index('ix_reward_redemptions_user_id', 'user_id'),
        Index('ix_reward_redemptions_reward_id', 'reward_id'),
        Index('ix_reward_redemptions_status', 'status'),
        Index('ix_reward_redemptions_created_at', 'created_at'),
    )

    def __repr__(self):
        return f"<RewardRedemption(id={self.id}, user_id={self.user_id}, points={self.points_used})>"

class UserPoints(Base):
    __tablename__ = "user_points"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, unique=True, index=True)
    total_points = Column(Integer, nullable=False, default=0)
    total_xp = Column(Integer, nullable=False, default=0)
    available_points = Column(Integer, nullable=False, default=0)
    redeemed_points = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationships
    user = relationship("User", backref="points")

    # Indexes
    __table_args__ = (
        Index('ix_user_points_user_id', 'user_id'),
        Index('ix_user_points_total_points', 'total_points'),
        Index('ix_user_points_available_points', 'available_points'),
    )

    def __repr__(self):
        return f"<UserPoints(user_id={self.user_id}, total={self.total_points}, available={self.available_points})>"

class PointsTransaction(Base):
    __tablename__ = "points_transactions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    points = Column(Integer, nullable=False)
    xp = Column(Integer, nullable=False, default=0)
    transaction_type = Column(String(50), nullable=False)  # 'earned', 'redeemed', 'bonus', 'penalty'
    source = Column(String(100), nullable=True)  # 'challenge', 'csr', 'training', 'manual', etc.
    source_id = Column(UUID(as_uuid=True), nullable=True)  # Reference to source entity
    description = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())

    # Relationships
    user = relationship("User", backref="points_transactions")

    # Indexes
    __table_args__ = (
        Index('ix_points_transactions_user_id', 'user_id'),
        Index('ix_points_transactions_transaction_type', 'transaction_type'),
        Index('ix_points_transactions_created_at', 'created_at'),
    )

    def __repr__(self):
        return f"<PointsTransaction(user_id={self.user_id}, points={self.points}, type={self.transaction_type})>"