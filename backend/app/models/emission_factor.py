from sqlalchemy import Column, String, Numeric, DateTime, Index, func, text
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.database import Base

class EmissionFactor(Base):
    __tablename__ = "emission_factors"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(120), nullable=False)
    activity_type = Column(String(60), nullable=False)
    unit = Column(String(20), nullable=False)
    kg_co2_per_unit = Column(Numeric(12, 4), nullable=False)
    source = Column(String(255), nullable=True)
    status = Column(String(20), nullable=False, default="active")
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    # Indexes
    __table_args__ = (
        Index('ix_emission_factors_activity_type_status', 'activity_type', 'status'),
    )

    def __repr__(self):
        return f"<EmissionFactor(id={self.id}, name={self.name}, activity_type={self.activity_type})>"