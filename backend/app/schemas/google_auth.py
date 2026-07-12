from pydantic import BaseModel, Field
from typing import Optional

class GoogleAuthUrlResponse(BaseModel):
    """Response containing Google OAuth authorization URL"""
    authorization_url: str
    state: Optional[str] = None

class GoogleCallbackRequest(BaseModel):
    """Request for Google OAuth callback"""
    code: str = Field(..., description="Authorization code from Google")
    state: Optional[str] = Field(None, description="State parameter for CSRF protection")

class GoogleLinkAccountRequest(BaseModel):
    """Request to link Google account to existing user"""
    code: str = Field(..., description="Authorization code from Google")

class GoogleAuthResponse(BaseModel):
    """Response after successful Google authentication"""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int
    user: dict
    is_new_user: bool = False

class GoogleUnlinkAccountResponse(BaseModel):
    """Response after unlinking Google account"""
    message: str