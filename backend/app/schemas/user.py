from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional
from uuid import UUID
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    admin = "admin"
    asset_manager = "asset_manager"
    department_head = "department_head"
    employee = "employee"

class UserStatus(str, Enum):
    active = "active"
    inactive = "inactive"
    locked = "locked"

class UserBase(BaseModel):
    email: EmailStr
    full_name: str = Field(..., min_length=2, max_length=120)
    department_id: Optional[UUID] = None
    role_id: int = Field(default=4, description="Defaults to employee role")

class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=100)

    @validator('password')
    def validate_password(cls, v):
        from app.security.password import validate_password_strength
        result = validate_password_strength(v)
        if not result["is_valid"]:
            raise ValueError(f"Password validation failed: {', '.join(result['errors'])}")
        return v

class UserUpdate(BaseModel):
    full_name: Optional[str] = Field(None, min_length=2, max_length=120)
    department_id: Optional[UUID] = None
    role_id: Optional[int] = None
    status: Optional[UserStatus] = None

class UserResponse(BaseModel):
    id: UUID
    email: str
    full_name: str
    department_id: Optional[UUID] = None
    role_id: int
    status: UserStatus
    must_change_password: bool
    last_login_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    provider: str = "email"
    profile_picture: Optional[str] = None
    manager_id: Optional[UUID] = None

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponseWithRole(UserResponse):
    role_name: Optional[str] = None
    department_name: Optional[str] = None
    manager_name: Optional[str] = None

    class Config:
        from_attributes = True