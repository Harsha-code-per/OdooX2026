from sqlalchemy import Column, DateTime, String, Index, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from app.database import Base

class PasswordResetToken(Base):
    __tablename__ = "password_reset_tokens"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    token_hash = Column(String(255), unique=True, nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    used_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="password_reset_tokens")

    # Indexes
    __table_args__ = (
        Index('ix_password_reset_tokens_user_id', 'user_id'),
        Index('ix_password_reset_tokens_expires_at', 'expires_at'),
    )

    @property
    def is_valid(self) -> bool:
        """Check if the token is valid (not expired and not used)"""
        if self.used_at is not None:
            return False
        from datetime import datetime
        return self.expires_at > datetime.utcnow()

    def mark_as_used(self):
        """Mark the token as used"""
        from datetime import datetime
        self.used_at = datetime.utcnow()

    def __repr__(self):
        return f"<PasswordResetToken(id={self.id}, user_id={self.user_id})>"