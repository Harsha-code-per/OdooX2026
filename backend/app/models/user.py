from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Enum as SQLEnum, Index, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship, backref
from sqlalchemy.sql import func
from enum import Enum
import uuid
from app.database import Base
import bcrypt
from datetime import datetime

class UserStatus(str, Enum):
    active = "ACTIVE"
    inactive = "INACTIVE"
    locked = "LOCKED"

class UserRole(str, Enum):
    admin = "admin"
    asset_manager = "asset_manager"
    department_head = "department_head"
    employee = "employee"

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=True)  # Nullable for Google auth users
    full_name = Column(String(120), nullable=False)
    department_id = Column(UUID(as_uuid=True), ForeignKey("departments.id"), nullable=True, index=True)
    role_id = Column(Integer, ForeignKey("roles.id"), nullable=False, default=4, index=True)  # Default to employee
    manager_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True, index=True)  # Self-referencing for manager relationship
    provider = Column(String(20), nullable=False, default="email")  # 'email' or 'google'
    google_id = Column(String(255), nullable=True, unique=True)  # Google user ID for OAuth users
    profile_picture = Column(String(500), nullable=True)  # URL to profile picture
    status = Column(SQLEnum(UserStatus), nullable=False, default=UserStatus.active, index=True)
    must_change_password = Column(Boolean, nullable=False, default=False)
    last_login_at = Column(DateTime(timezone=True), nullable=True)
    failed_login_attempts = Column(Integer, nullable=False, default=0)
    locked_until = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationships
    department = relationship("Department", back_populates="users", foreign_keys=[department_id])
    role = relationship("Role", back_populates="users")
    manager = relationship("User", remote_side=[id], backref="subordinates")
    refresh_tokens = relationship("RefreshToken", back_populates="user", cascade="all, delete-orphan")
    password_reset_tokens = relationship("PasswordResetToken", back_populates="user", cascade="all, delete-orphan")
    email_verification_tokens = relationship("EmailVerificationToken", back_populates="user", cascade="all, delete-orphan")

    # Indexes
    __table_args__ = (
        Index('ix_users_email', 'email'),
        Index('ix_users_department_id', 'department_id'),
        Index('ix_users_role_id', 'role_id'),
        Index('ix_users_status', 'status'),
        Index('ix_users_manager_id', 'manager_id'),
    )

    def set_password(self, password: str):
        """Hash and set the user's password"""
        salt = bcrypt.gensalt(rounds=12)
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

    def verify_password(self, password: str) -> bool:
        """Verify the provided password against the hash"""
        if not self.password_hash:
            return False  # No password set (Google auth user)
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))

    def is_google_user(self) -> bool:
        """Check if user authenticated via Google"""
        return self.provider == "google"

    def has_password(self) -> bool:
        """Check if user has a password set"""
        return self.password_hash is not None

    def is_locked(self) -> bool:
        """Check if the user account is currently locked"""
        if self.locked_until and self.locked_until > datetime.utcnow():
            return True
        return False

    def record_failed_login(self):
        """Increment failed login attempts and potentially lock account"""
        self.failed_login_attempts += 1
        if self.failed_login_attempts >= 5:  # Max attempts from config
            from datetime import timedelta
            self.locked_until = datetime.utcnow() + timedelta(minutes=30)
            self.status = UserStatus.locked

    def record_successful_login(self):
        """Reset failed login attempts on successful login"""
        self.failed_login_attempts = 0
        self.locked_until = None
        if self.status == UserStatus.locked:
            self.status = UserStatus.active
        self.last_login_at = datetime.utcnow()

    def __repr__(self):
        return f"<User(id={self.id}, email={self.email}, role={self.role_id})>"