from sqlalchemy import Column, String, Numeric, DateTime, Date, ForeignKey, Index, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from app.database import Base

class EnvironmentalGoal(Base):
    __tablename__ = "environmental_goals"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(120), nullable=False)
    department_id = Column(UUID(as_uuid=True), ForeignKey("departments.id"), nullable=False)
    target_co2_kg = Column(Numeric(14, 2), nullable=False)
    current_co2_kg = Column(Numeric(14, 2), nullable=False, default=0)
    deadline = Column(Date, nullable=False)
    status = Column(String(20), nullable=False, default="active")
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationships
    department = relationship("Department", back_populates="environmental_goals")

    # Indexes
    __table_args__ = (
        Index('ix_environmental_goals_department_id_status', 'department_id', 'status'),
        Index('ix_environmental_goals_deadline', 'deadline'),
    )

    def __repr__(self):
        return f"<EnvironmentalGoal(id={self.id}, name={self.name}, department_id={self.department_id})>"