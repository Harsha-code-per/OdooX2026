from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from sqlalchemy.orm import selectinload
from typing import Optional, Dict, Any
from uuid import UUID
import httpx
from urllib.parse import urlencode

from app.models.user import User, UserStatus
from app.config import get_settings

settings = get_settings()

class GoogleAuthService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.client_id = settings.GOOGLE_CLIENT_ID
        self.client_secret = settings.GOOGLE_CLIENT_SECRET
        self.redirect_uri = settings.GOOGLE_REDIRECT_URI
        self.authorization_url = settings.GOOGLE_AUTHORIZATION_URL
        self.token_url = settings.GOOGLE_TOKEN_URL
        self.userinfo_url = settings.GOOGLE_USERINFO_URL

    def get_authorization_url(self, state: str = None) -> str:
        """Generate Google OAuth authorization URL"""
        if not self.client_id:
            raise ValueError("Google OAuth not configured. Please set GOOGLE_CLIENT_ID.")

        params = {
            "client_id": self.client_id,
            "redirect_uri": self.redirect_uri,
            "scope": "openid email profile",
            "response_type": "code",
            "access_type": "offline",
            "prompt": "consent"
        }

        if state:
            params["state"] = state

        return f"{self.authorization_url}?{urlencode(params)}"

    async def exchange_code_for_tokens(self, code: str) -> Dict[str, Any]:
        """Exchange authorization code for access token"""
        if not self.client_id or not self.client_secret:
            raise ValueError("Google OAuth not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.")

        data = {
            "code": code,
            "client_id": self.client_id,
            "client_secret": self.client_secret,
            "redirect_uri": self.redirect_uri,
            "grant_type": "authorization_code"
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(self.token_url, data=data)
            response.raise_for_status()
            return response.json()

    async def get_user_info(self, access_token: str) -> Dict[str, Any]:
        """Get user information from Google using access token"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                self.userinfo_url,
                headers={"Authorization": f"Bearer {access_token}"}
            )
            response.raise_for_status()
            return response.json()

    async def handle_google_callback(self, code: str) -> tuple[Optional[User], Optional[str]]:
        """Handle Google OAuth callback - process code and create/update user"""
        try:
            # Exchange code for tokens
            tokens = await self.exchange_code_for_tokens(code)
            access_token = tokens.get("access_token")

            if not access_token:
                return None, "Failed to obtain access token from Google"

            # Get user info
            user_info = await self.get_user_info(access_token)

            google_id = user_info.get("id")
            email = user_info.get("email")
            name = user_info.get("name")
            picture = user_info.get("picture")

            if not google_id or not email:
                return None, "Invalid user data received from Google"

            # Check if user exists by Google ID
            result = await self.db.execute(
                select(User).where(User.google_id == google_id)
            )
            user = result.scalar_one_or_none()

            if user:
                # Update existing user's info
                user.full_name = name
                user.profile_picture = picture
                if user.status == UserStatus.inactive:
                    user.status = UserStatus.active
                await self.db.commit()
                return user, None

            # Check if user exists by email (link Google account)
            result = await self.db.execute(
                select(User).where(User.email == email)
            )
            existing_user = result.scalar_one_or_none()

            if existing_user:
                if existing_user.provider == "email":
                    # Link Google account to existing email user
                    existing_user.google_id = google_id
                    existing_user.profile_picture = picture
                    if existing_user.full_name != name:
                        existing_user.full_name = name
                    await self.db.commit()
                    return existing_user, None
                else:
                    return None, "Email already registered with another provider"

            # Create new user
            new_user = User(
                email=email,
                full_name=name,
                google_id=google_id,
                provider="google",
                status=UserStatus.active,  # Google users are active immediately
                role_id=4,  # Default to employee role
                password_hash=None  # No password for Google users
            )

            # Set profile picture if provided
            if picture:
                new_user.profile_picture = picture

            self.db.add(new_user)
            await self.db.commit()

            return new_user, None

        except httpx.HTTPError as e:
            return None, f"HTTP error during Google OAuth: {str(e)}"
        except Exception as e:
            return None, f"Error during Google authentication: {str(e)}"

    async def link_google_account(self, user_id: UUID, google_code: str) -> tuple[bool, str]:
        """Link Google account to existing email user"""
        try:
            # Get user
            result = await self.db.execute(
                select(User).where(User.id == user_id)
            )
            user = result.scalar_one_or_none()

            if not user:
                return False, "User not found"

            if user.provider == "google":
                return False, "User already has Google authentication"

            # Exchange code and get Google info
            tokens = await self.exchange_code_for_tokens(google_code)
            access_token = tokens.get("access_token")

            if not access_token:
                return False, "Failed to obtain access token from Google"

            user_info = await self.get_user_info(access_token)
            google_id = user_info.get("id")

            # Check if Google ID is already linked to another account
            result = await self.db.execute(
                select(User).where(
                    and_(
                        User.google_id == google_id,
                        User.id != user_id
                    )
                )
            )
            existing_link = result.scalar_one_or_none()

            if existing_link:
                return False, "Google account already linked to another user"

            # Link Google account
            user.google_id = google_id
            if user_info.get("picture"):
                user.profile_picture = user_info.get("picture")

            await self.db.commit()
            return True, "Google account linked successfully"

        except Exception as e:
            return False, f"Error linking Google account: {str(e)}"

    async def unlink_google_account(self, user_id: UUID) -> tuple[bool, str]:
        """Unlink Google account from user (requires having a password set)"""
        try:
            result = await self.db.execute(
                select(User).where(User.id == user_id)
            )
            user = result.scalar_one_or_none()

            if not user:
                return False, "User not found"

            if user.provider == "google" and not user.has_password():
                return False, "Cannot unlink Google account without a password. Please set a password first."

            user.google_id = None
            user.provider = "email"
            await self.db.commit()

            return True, "Google account unlinked successfully"

        except Exception as e:
            return False, f"Error unlinking Google account: {str(e)}"