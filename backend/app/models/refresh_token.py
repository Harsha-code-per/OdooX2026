from sqlalchemy import Column, DateTime, String, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from app.database import Base

class RefreshToken(Base):
    __tablename__ = "refresh_tokens"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    token_hash = Column(String(255), unique=True, nullable=False)
    issued_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    expires_at = Column(DateTime(timezone=True), nullable=False)
    revoked_at = Column(DateTime(timezone=True), nullable=True)
    user_agent = Column(String(255), nullable=True)
    ip_address = Column(String(45), nullable=True)

    # Relationships
    user = relationship("User", back_populates="refresh_tokens")

    # Indexes
    __table_args__ = (
        Index('ix_refresh_tokens_user_id', 'user_id'),
        Index('ix_refresh_tokens_expires_at', 'expires_at'),
        Index('ix_refresh_tokens_user_id_revoked_at', 'user_id', 'revoked_at'),
    )

    @property
    def is_valid(self) -> bool:
        """Check if the token is valid (not expired and not revoked)"""
        if self.revoked_at is not None:
            return False
        from datetime import datetime
        return self.expires_at > datetime.utcnow()

    def revoke(self):
        """Revoke the token"""
        from datetime import datetime
        self.revoked_at = datetime.utcnow()

    def __repr__(self):
        return f"<RefreshToken(id={self.id}, user_id={self.user_id}, expires_at={self.expires_at})>"