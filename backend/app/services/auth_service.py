from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_
from sqlalchemy.orm import selectinload
from typing import Optional, Tuple, Dict, Any
from datetime import datetime, timedelta
from uuid import UUID
import uuid

from app.models.user import User, UserStatus
from app.models.refresh_token import RefreshToken
from app.models.password_reset_token import PasswordResetToken
from app.models.email_verification_token import EmailVerificationToken
from app.models.role import Role
from app.models.department import Department
from app.schemas.auth import (
    LoginRequest, LoginResponse, RefreshTokenResponse,
    RegisterRequest, TokenResponse
)
from app.security import (
    create_access_token, create_refresh_token, verify_token,
    hash_token, generate_verification_token, hash_verification_token,
    verify_password, hash_password
)
from app.config import get_settings

settings = get_settings()

class AuthService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def register_user(self, user_data: RegisterRequest) -> Tuple[User, str]:
        """Register a new user and create email verification token"""
        # Check if user already exists
        existing_user = await self.db.execute(
            select(User).where(User.email == user_data.email)
        )
        if existing_user.scalar_one_or_none():
            raise ValueError("User with this email already exists")

        # Create new user
        user = User(
            email=user_data.email,
            full_name=user_data.full_name,
            department_id=user_data.department_id,
            role_id=4,  # Default to employee role
            provider="email"  # Email registration
        )
        user.set_password(user_data.password)
        user.status = UserStatus.INACTIVE  # Inactive until email verified

        self.db.add(user)
        await self.db.flush()

        # Create email verification token
        verification_token = generate_verification_token()
        token_hash = hash_verification_token(verification_token)

        email_token = EmailVerificationToken(
            user_id=user.id,
            token_hash=token_hash,
            email=user_data.email,
            expires_at=datetime.utcnow() + timedelta(hours=settings.EMAIL_VERIFICATION_TOKEN_EXPIRE_HOURS)
        )

        self.db.add(email_token)
        await self.db.commit()

        return user, verification_token

    async def authenticate_user(self, login_data: LoginRequest, user_agent: str = None, ip_address: str = None) -> Tuple[Optional[User], Optional[str]]:
        """Authenticate user and return user with error message if failed"""
        result = await self.db.execute(
            select(User)
            .options(selectinload(User.role), selectinload(User.department))
            .where(User.email == login_data.email)
        )
        user = result.scalar_one_or_none()

        if not user:
            return None, "Invalid email or password"

        # Check if account is locked
        if user.is_locked():
            return None, "Account is locked due to multiple failed login attempts"

        # Check if account is inactive
        if user.status == UserStatus.INACTIVE:
            return None, "Please verify your email before logging in"

        # Verify password
        if not user.verify_password(login_data.password):
            user.record_failed_login()
            await self.db.commit()
            return None, "Invalid email or password"

        # Check if password change is required
        if user.must_change_password:
            # Allow login but indicate password change is needed
            pass

        # Record successful login
        user.record_successful_login()
        await self.db.commit()

        return user, None

    async def create_tokens(self, user: User, user_agent: str = None, ip_address: str = None) -> LoginResponse:
        """Create access and refresh tokens for user"""
        # Create access token
        access_token = create_access_token({
            "sub": str(user.id),
            "email": user.email,  # Include email in token for internal use
            "role_id": user.role_id,
            "full_name": user.full_name
        })

        # Create refresh token
        refresh_token, token_hash = create_refresh_token(str(user.id))

        # Store refresh token in database
        db_refresh_token = RefreshToken(
            user_id=user.id,
            token_hash=token_hash,
            expires_at=datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
            user_agent=user_agent,
            ip_address=ip_address
        )

        self.db.add(db_refresh_token)
        await self.db.commit()

        return LoginResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            user={
                "id": str(user.id),
                "full_name": user.full_name,
                "role_id": user.role_id,
                "must_change_password": user.must_change_password,
                "provider": user.provider,
                "profile_picture": user.profile_picture
            }
        )

    async def refresh_tokens(self, old_refresh_token: str) -> Optional[RefreshTokenResponse]:
        """Refresh tokens using old refresh token with token rotation"""
        # Verify the old refresh token
        payload = verify_token(old_refresh_token, "refresh")
        if not payload:
            return None

        user_id = payload.get("sub")
        jti = payload.get("jti")  # JWT ID for token rotation

        # Find the token in database
        result = await self.db.execute(
            select(RefreshToken).where(
                RefreshToken.user_id == uuid.UUID(user_id),
                RefreshToken.token_hash == hash_token(old_refresh_token)
            )
        )
        refresh_token_record = result.scalar_one_or_none()

        if not refresh_token_record or not refresh_token_record.is_valid:
            return None

        # Revoke old token (token rotation)
        refresh_token_record.revoke()

        # Get user
        result = await self.db.execute(
            select(User).where(User.id == uuid.UUID(user_id))
        )
        user = result.scalar_one_or_none()

        if not user:
            return None

        # Create new tokens
        access_token = create_access_token({
            "sub": str(user.id),
            "email": user.email,
            "role_id": user.role_id,
            "full_name": user.full_name
        })

        new_refresh_token, new_token_hash = create_refresh_token(str(user.id))

        # Create new refresh token record
        new_db_refresh_token = RefreshToken(
            user_id=user.id,
            token_hash=new_token_hash,
            expires_at=datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
        )

        self.db.add(new_db_refresh_token)
        await self.db.commit()

        return RefreshTokenResponse(
            access_token=access_token,
            refresh_token=new_refresh_token,
            token_type="bearer",
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
        )

    async def logout(self, refresh_token: str) -> bool:
        """Logout user by revoking refresh token"""
        payload = verify_token(refresh_token, "refresh")
        if not payload:
            return False

        user_id = payload.get("sub")

        # Find and revoke the token
        result = await self.db.execute(
            select(RefreshToken).where(
                RefreshToken.user_id == uuid.UUID(user_id),
                RefreshToken.token_hash == hash_token(refresh_token)
            )
        )
        refresh_token_record = result.scalar_one_or_none()

        if refresh_token_record:
            refresh_token_record.revoke()
            await self.db.commit()
            return True

        return False

    async def logout_all(self, user_id: UUID) -> int:
        """Logout user from all devices by revoking all refresh tokens"""
        result = await self.db.execute(
            select(RefreshToken).where(
                RefreshToken.user_id == user_id,
                RefreshToken.revoked_at.is_(None)
            )
        )
        tokens = result.scalars().all()

        count = 0
        for token in tokens:
            token.revoke()
            count += 1

        await self.db.commit()
        return count

    async def create_password_reset_token(self, email: str) -> Optional[str]:
        """Create password reset token and return the raw token"""
        result = await self.db.execute(
            select(User).where(User.email == email)
        )
        user = result.scalar_one_or_none()

        if not user:
            # Don't reveal if user exists or not
            return None

        # Invalidate any existing reset tokens
        await self.db.execute(
            select(PasswordResetToken).where(
                PasswordResetToken.user_id == user.id,
                PasswordResetToken.used_at.is_(None)
            )
        )
        existing_tokens = (await self.db.execute(
            select(PasswordResetToken).where(
                PasswordResetToken.user_id == user.id,
                PasswordResetToken.used_at.is_(None)
            )
        )).scalars().all()

        for token in existing_tokens:
            token.used_at = datetime.utcnow()  # Mark as used to invalidate

        # Create new reset token
        reset_token = generate_verification_token()
        token_hash = hash_verification_token(reset_token)

        db_reset_token = PasswordResetToken(
            user_id=user.id,
            token_hash=token_hash,
            expires_at=datetime.utcnow() + timedelta(hours=settings.PASSWORD_RESET_TOKEN_EXPIRE_HOURS)
        )

        self.db.add(db_reset_token)
        await self.db.commit()

        return reset_token

    async def reset_password(self, token: str, new_password: str) -> bool:
        """Reset user password using valid token"""
        token_hash = hash_verification_token(token)

        result = await self.db.execute(
            select(PasswordResetToken).where(
                PasswordResetToken.token_hash == token_hash
            )
        )
        reset_token = result.scalar_one_or_none()

        if not reset_token or not reset_token.is_valid:
            return False

        # Update user password
        user_result = await self.db.execute(
            select(User).where(User.id == reset_token.user_id)
        )
        user = user_result.scalar_one_or_none()

        if not user:
            return False

        user.set_password(new_password)
        user.must_change_password = True  # Require password change on next login

        # Mark token as used
        reset_token.mark_as_used()

        await self.db.commit()
        return True

    async def change_password(self, user_id: UUID, old_password: str, new_password: str) -> bool:
        """Change user password (authenticated)"""
        result = await self.db.execute(
            select(User).where(User.id == user_id)
        )
        user = result.scalar_one_or_none()

        if not user:
            return False

        # Verify old password
        if not user.verify_password(old_password):
            return False

        # Set new password
        user.set_password(new_password)
        user.must_change_password = False

        await self.db.commit()
        return True

    async def verify_email(self, token: str) -> bool:
        """Verify user email using token"""
        token_hash = hash_verification_token(token)

        result = await self.db.execute(
            select(EmailVerificationToken).where(
                EmailVerificationToken.token_hash == token_hash
            )
        )
        email_token = result.scalar_one_or_none()

        if not email_token or not email_token.is_valid:
            return False

        # Update user status
        user_result = await self.db.execute(
            select(User).where(User.id == email_token.user_id)
        )
        user = user_result.scalar_one_or_none()

        if not user:
            return False

        user.status = UserStatus.ACTIVE

        # Mark token as verified
        email_token.mark_as_verified()

        await self.db.commit()
        return True

    async def get_user_by_id(self, user_id: UUID) -> Optional[Dict[str, Any]]:
        """Get user by ID with role, department, and manager info"""
        result = await self.db.execute(
            select(User)
            .options(
                selectinload(User.role),
                selectinload(User.department),
                selectinload(User.manager)
            )
            .where(User.id == user_id)
        )
        user = result.scalar_one_or_none()

        if not user:
            return None

        return {
            "id": str(user.id),
            "full_name": user.full_name,
            "role_id": user.role_id,
            "role_name": user.role.name if user.role else None,
            "department_id": str(user.department_id) if user.department_id else None,
            "department_name": user.department.name if user.department else None,
            "manager_id": str(user.manager_id) if user.manager_id else None,
            "manager_name": user.manager.full_name if user.manager else None,
            "status": user.status.value,
            "must_change_password": user.must_change_password,
            "provider": user.provider,
            "profile_picture": user.profile_picture,
            "last_login_at": user.last_login_at.isoformat() if user.last_login_at else None,
            "created_at": user.created_at.isoformat() if user.created_at else None,
            "updated_at": user.updated_at.isoformat() if user.updated_at else None
        }