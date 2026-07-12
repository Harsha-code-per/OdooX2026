import secrets
import string
from typing import Optional
from passlib.context import CryptContext
from app.config import get_settings

settings = get_settings()

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    """Hash a password using bcrypt"""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against a hash"""
    return pwd_context.verify(plain_password, hashed_password)

def generate_secure_password(length: int = 16) -> str:
    """Generate a secure random password"""
    alphabet = string.ascii_letters + string.digits + "!@#$%^&*()_+-=[]{}|;:,.<>?"
    password = ''.join(secrets.choice(alphabet) for _ in range(length))
    return password

def validate_password_strength(password: str) -> dict:
    """Validate password strength and return feedback"""
    result = {
        "is_valid": True,
        "errors": [],
        "warnings": []
    }

    # Length check
    if len(password) < 8:
        result["is_valid"] = False
        result["errors"].append("Password must be at least 8 characters long")

    # Complexity checks
    has_upper = any(c.isupper() for c in password)
    has_lower = any(c.islower() for c in password)
    has_digit = any(c.isdigit() for c in password)
    has_special = any(c in "!@#$%^&*()_+-=[]{}|;:,.<>?" for c in password)

    if not (has_upper and has_lower):
        result["is_valid"] = False
        result["errors"].append("Password must contain both uppercase and lowercase letters")

    if not has_digit:
        result["is_valid"] = False
        result["errors"].append("Password must contain at least one digit")

    if not has_special:
        result["warnings"].append("Password should contain at least one special character")

    # Additional warnings
    if len(password) < 12:
        result["warnings"].append("Password would be stronger if it was at least 12 characters long")

    return result