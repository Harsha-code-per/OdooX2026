from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from secrets import token_urlsafe
import logging

logger = logging.getLogger(__name__)

from app.database import get_db
from app.schemas.auth import (
    LoginRequest, LoginResponse, RegisterRequest, RegisterResponse,
    RefreshTokenRequest, RefreshTokenResponse, EmailVerificationRequest,
    EmailVerificationResponse, PasswordResetRequest, PasswordResetConfirm,
    PasswordChangeRequest, LogoutResponse
)
from app.schemas.google_auth import (
    GoogleAuthUrlResponse, GoogleCallbackRequest, GoogleAuthResponse,
    GoogleLinkAccountRequest, GoogleUnlinkAccountResponse
)
from app.services.auth_service import AuthService
from app.services.google_auth_service import GoogleAuthService
from app.dependencies.auth import get_current_user
from app.utils.email import email_service

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=RegisterResponse, status_code=status.HTTP_201_CREATED)
async def register(
    user_data: RegisterRequest,
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """Register a new user account"""
    try:
        auth_service = AuthService(db)
        user, verification_token = await auth_service.register_user(user_data)

        # Send verification email
        await email_service.send_verification_email(user.email, verification_token)

        return RegisterResponse(
            message="User registered successfully. Please check your email to verify your account.",
            user_id=user.id,
            email_verification_required=True
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.exception(f"Registration error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred during registration: {str(e)}"
        )

@router.post("/login", response_model=LoginResponse)
async def login(
    login_data: LoginRequest,
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """Authenticate user and return JWT tokens"""
    auth_service = AuthService(db)

    # Get user agent and IP address
    user_agent = request.headers.get("user-agent")
    # In production, you might want to use a proper IP extraction method
    ip_address = request.client.host if request.client else None

    user, error_message = await auth_service.authenticate_user(login_data, user_agent, ip_address)

    if error_message:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=error_message,
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create tokens
    tokens = await auth_service.create_tokens(user, user_agent, ip_address)

    return tokens

@router.post("/refresh", response_model=RefreshTokenResponse)
async def refresh_token(
    refresh_data: RefreshTokenRequest,
    db: AsyncSession = Depends(get_db)
):
    """Refresh access token using refresh token"""
    auth_service = AuthService(db)

    tokens = await auth_service.refresh_tokens(refresh_data.refresh_token)

    if not tokens:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return tokens

@router.post("/logout", response_model=LogoutResponse)
async def logout(
    refresh_data: RefreshTokenRequest,
    db: AsyncSession = Depends(get_db)
):
    """Logout user and revoke refresh token"""
    auth_service = AuthService(db)

    success = await auth_service.logout(refresh_data.refresh_token)

    if not success:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )

    return LogoutResponse(message="Successfully logged out")

@router.post("/logout-all")
async def logout_all(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Logout user from all devices"""
    auth_service = AuthService(db)

    from uuid import UUID
    count = await auth_service.logout_all(UUID(current_user["id"]))

    return {"message": f"Logged out from {count} devices"}

@router.post("/verify-email", response_model=EmailVerificationResponse)
async def verify_email(
    verification_data: EmailVerificationRequest,
    db: AsyncSession = Depends(get_db)
):
    """Verify user email address"""
    auth_service = AuthService(db)

    success = await auth_service.verify_email(verification_data.token)

    if not success:
        return EmailVerificationResponse(
            message="Invalid or expired verification token",
            success=False
        )

    return EmailVerificationResponse(
        message="Email verified successfully. You can now login.",
        success=True
    )

@router.post("/reset-password")
async def request_password_reset(
    reset_data: PasswordResetRequest,
    db: AsyncSession = Depends(get_db)
):
    """Request password reset (sends email with reset token)"""
    auth_service = AuthService(db)

    reset_token = await auth_service.create_password_reset_token(reset_data.email)

    # Send password reset email if token was created
    if reset_token:
        await email_service.send_password_reset_email(reset_data.email, reset_token)

    return {
        "message": "If an account with this email exists, a password reset link has been sent."
    }

@router.post("/reset-password/confirm")
async def confirm_password_reset(
    confirm_data: PasswordResetConfirm,
    db: AsyncSession = Depends(get_db)
):
    """Confirm password reset with token"""
    auth_service = AuthService(db)

    success = await auth_service.reset_password(confirm_data.token, confirm_data.new_password)

    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token"
        )

    return {"message": "Password reset successfully. You can now login with your new password."}

@router.post("/change-password")
async def change_password(
    password_data: PasswordChangeRequest,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Change password for authenticated user"""
    auth_service = AuthService(db)

    from uuid import UUID
    success = await auth_service.change_password(
        UUID(current_user["id"]),
        password_data.old_password,
        password_data.new_password
    )

    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )

    # Send password change notification
    await email_service.send_password_change_notification(current_user["email"])

    return {"message": "Password changed successfully"}

@router.get("/me")
async def get_current_user_info(
    current_user: dict = Depends(get_current_user)
):
    """Get current user information"""
    return current_user

# Google OAuth Endpoints

@router.get("/google/login", response_model=GoogleAuthUrlResponse)
async def google_login():
    """Get Google OAuth authorization URL"""
    state = token_urlsafe(32)  # Generate secure random state for CSRF protection

    google_service = GoogleAuthService(None)  # No DB needed for URL generation
    try:
        auth_url = google_service.get_authorization_url(state)

        return GoogleAuthUrlResponse(
            authorization_url=auth_url,
            state=state
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail=str(e)
        )

@router.post("/google/callback", response_model=GoogleAuthResponse)
async def google_callback(
    callback_data: GoogleCallbackRequest,
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """Handle Google OAuth callback and authenticate user"""
    google_service = GoogleAuthService(db)

    try:
        # Process Google authentication
        user, error_message = await google_service.handle_google_callback(callback_data.code)

        if error_message:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=error_message
            )

        if not user:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to authenticate user with Google"
            )

        # Get user agent and IP address
        user_agent = request.headers.get("user-agent")
        ip_address = request.client.host if request.client else None

        # Create tokens using auth service
        auth_service = AuthService(db)
        tokens = await auth_service.create_tokens(user, user_agent, ip_address)

        # Check if this is a new user (created during this OAuth flow)
        is_new_user = not user.must_change_password and user.department_id is None

        return GoogleAuthResponse(
            access_token=tokens.access_token,
            refresh_token=tokens.refresh_token,
            token_type=tokens.token_type,
            expires_in=tokens.expires_in,
            user=tokens.user,
            is_new_user=is_new_user
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error during Google authentication: {str(e)}"
        )

@router.post("/google/link")
async def link_google_account(
    link_data: GoogleLinkAccountRequest,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Link Google account to existing user account"""
    from uuid import UUID

    google_service = GoogleAuthService(db)

    try:
        success, message = await google_service.link_google_account(
            UUID(current_user["id"]),
            link_data.code
        )

        if not success:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=message
            )

        return {"message": message}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error linking Google account: {str(e)}"
        )

@router.post("/google/unlink", response_model=GoogleUnlinkAccountResponse)
async def unlink_google_account(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Unlink Google account from user account"""
    from uuid import UUID

    google_service = GoogleAuthService(db)

    try:
        success, message = await google_service.unlink_google_account(UUID(current_user["id"]))

        if not success:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=message
            )

        return GoogleUnlinkAccountResponse(message=message)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error unlinking Google account: {str(e)}"
        )