from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.config import get_settings
import secrets
import hashlib

settings = get_settings()

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({
        "exp": expire,
        "iat": datetime.utcnow(),
        "type": "access"
    })

    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def create_refresh_token(user_id: str, expires_delta: Optional[timedelta] = None) -> tuple[str, str]:
    """Create a JWT refresh token and return (token, token_hash)"""
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)

    # Create the raw token
    token_data = {
        "sub": str(user_id),
        "exp": expire,
        "iat": datetime.utcnow(),
        "type": "refresh",
        "jti": secrets.token_urlsafe(32)  # Unique identifier for token rotation
    }

    raw_token = jwt.encode(token_data, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

    # Create hash for storage (SHA-256 as per schema)
    token_hash = hashlib.sha256(raw_token.encode()).hexdigest()

    return raw_token, token_hash

def verify_token(token: str, token_type: str = "access") -> Optional[Dict[str, Any]]:
    """Verify a JWT token and return the payload"""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])

        # Check token type
        if payload.get("type") != token_type:
            return None

        # Check expiration
        exp = payload.get("exp")
        if exp is None or datetime.fromtimestamp(exp) < datetime.utcnow():
            return None

        return payload
    except JWTError:
        return None

def get_token_payload(token: str) -> Optional[Dict[str, Any]]:
    """Get the payload from a token without verification (for already verified tokens)"""
    try:
        payload = jwt.decode(token, options={"verify_signature": False})
        return payload
    except JWTError:
        return None

def hash_token(token: str) -> str:
    """Hash a token for storage using SHA-256"""
    return hashlib.sha256(token.encode()).hexdigest()

def verify_token_hash(token: str, token_hash: str) -> bool:
    """Verify a token against its hash"""
    return hash_token(token) == token_hash

def generate_verification_token() -> str:
    """Generate a secure random token for email verification and password reset"""
    return secrets.urlsafe_b64encode(secrets.token_bytes(32)).decode('utf-8')

def hash_verification_token(token: str) -> str:
    """Hash a verification token for storage"""
    return hash_token(token)