from sqlalchemy import Column, DateTime, String, Index, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from app.database import Base

class EmailVerificationToken(Base):
    __tablename__ = "email_verification_tokens"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    token_hash = Column(String(255), unique=True, nullable=False)
    email = Column(String(255), nullable=False)  # Store the email being verified
    expires_at = Column(DateTime(timezone=True), nullable=False)
    verified_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="email_verification_tokens")

    # Indexes
    __table_args__ = (
        Index('ix_email_verification_tokens_user_id', 'user_id'),
        Index('ix_email_verification_tokens_expires_at', 'expires_at'),
        Index('ix_email_verification_tokens_token_hash', 'token_hash'),
    )

    @property
    def is_valid(self) -> bool:
        """Check if the token is valid (not expired and not already verified)"""
        if self.verified_at is not None:
            return False
        from datetime import datetime
        return self.expires_at > datetime.utcnow()

    def mark_as_verified(self):
        """Mark the token as verified"""
        from datetime import datetime
        self.verified_at = datetime.utcnow()

    def __repr__(self):
        return f"<EmailVerificationToken(id={self.id}, email={self.email})>"