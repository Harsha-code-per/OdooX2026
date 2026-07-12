from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum as SQLEnum, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from enum import Enum
import uuid
from app.database import Base

class DepartmentStatus(str, Enum):
    active = "ACTIVE"
    inactive = "INACTIVE"

class Department(Base):
    __tablename__ = "departments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(120), nullable=False)
    code = Column(String(20), unique=True, nullable=False)
    head_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    parent_department_id = Column(UUID(as_uuid=True), ForeignKey("departments.id"), nullable=True)
    employee_count = Column(Integer, nullable=False, default=0)
    status = Column(SQLEnum(DepartmentStatus), nullable=False, default=DepartmentStatus.active)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationships
    parent_department = relationship("Department", remote_side=[id], backref="child_departments")
    head_user = relationship("User", foreign_keys=[head_user_id])
    users = relationship("User", back_populates="department", foreign_keys="User.department_id")
    environmental_goals = relationship("EnvironmentalGoal", back_populates="department")

    # Indexes
    __table_args__ = (
        Index('ix_departments_status', 'status'),
        Index('ix_departments_parent_department_id', 'parent_department_id'),
    )

    def __repr__(self):
        return f"<Department(id={self.id}, name={self.name}, code={self.code})>"