from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional, Dict, Any
from uuid import UUID

from app.database import get_db
from app.security import verify_token
from app.services.auth_service import AuthService

security = HTTPBearer()

class AuthDependencies:
    def __init__(self):
        pass

    async def get_current_user(
        self,
        credentials: HTTPAuthorizationCredentials = Depends(security),
        db: AsyncSession = Depends(get_db)
    ) -> Dict[str, Any]:
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

        # Get user from database
        auth_service = AuthService(db)
        user = await auth_service.get_user_by_id(UUID(user_id))

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
                headers={"WWW-Authenticate": "Bearer"},
            )

        if user.get("status") != "active":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is not active"
            )

        return user

    async def get_current_active_user(
        self,
        current_user: Dict[str, Any] = Depends(get_current_user)
    ) -> Dict[str, Any]:
        """Get current active user (additional check for active status)"""
        if current_user.get("status") != "active":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is not active"
            )
        return current_user

    async def require_role(
        self,
        current_user: Dict[str, Any] = Depends(get_current_user),
        required_roles: list = None
    ) -> Dict[str, Any]:
        """Require specific roles to access endpoint"""
        if required_roles is None:
            required_roles = []

        user_role_id = current_user.get("role_id")

        # Check if user has required role (you may want to implement role checking logic)
        # For now, this is a placeholder that you can customize based on your role system

        return current_user

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db)
) -> Dict[str, Any]:
    """Get current authenticated user from JWT token"""
    auth_deps = AuthDependencies()
    return await auth_deps.get_current_user(credentials, db)

async def get_current_active_user(
    current_user: Dict[str, Any] = Depends(get_current_user)
) -> Dict[str, Any]:
    """Get current active user"""
    auth_deps = AuthDependencies()
    return await auth_deps.get_current_active_user(current_user)