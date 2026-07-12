from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import Optional, Dict, Any
from uuid import UUID

from app.database import get_db
from app.security import verify_token
from app.models.user import User, UserStatus

security = HTTPBearer()

class AuthDependencies:
    def __init__(self):
        pass

    async def get_current_user(
        self,
        credentials: HTTPAuthorizationCredentials = Depends(security),
        db: AsyncSession = Depends(get_db)
    ) -> User:
        """Get current authenticated user from JWT token"""
        token = credentials.credentials

        # Verify token
        payload = verify_token(token, "access")
        if not payload:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )

        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Get user from database with role and department relationships loaded
        result = await db.execute(
            select(User)
            .options(
                selectinload(User.role),
                selectinload(User.department),
                selectinload(User.manager)
            )
            .where(User.id == UUID(user_id))
        )
        user = result.scalar_one_or_none()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
                headers={"WWW-Authenticate": "Bearer"},
            )

        if user.status != UserStatus.ACTIVE:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is not active"
            )

        return user

    async def get_current_active_user(
        self,
        current_user: User = Depends(get_current_user)
    ) -> User:
        """Get current active user (additional check for active status)"""
        if current_user.status != UserStatus.ACTIVE:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is not active"
            )
        return current_user

    async def require_role(
        self,
        current_user: User = Depends(get_current_user),
        required_roles: list = None
    ) -> User:
        """Require specific roles to access endpoint"""
        if required_roles is None:
            required_roles = []

        # Check if user has required role
        if current_user.role and current_user.role.name not in required_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Operation not permitted for this role"
            )

        return current_user

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db)
) -> User:
    """Get current authenticated user from JWT token"""
    auth_deps = AuthDependencies()
    return await auth_deps.get_current_user(credentials, db)

async def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """Get current active user"""
    auth_deps = AuthDependencies()
    return await auth_deps.get_current_active_user(current_user)

async def get_current_admin_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """Require user to be an admin"""
    if not current_user.role or current_user.role.name != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin role required"
        )
    return current_user