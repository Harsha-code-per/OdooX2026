from sqlalchemy import Column, String, DateTime, Date, Boolean, Text, Index, func
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.database import Base

class ESGPolicy(Base):
    __tablename__ = "esg_policies"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    esg_category = Column(String(20), nullable=False)
    version = Column(String(20), nullable=False, default="1.0")
    effective_date = Column(Date, nullable=False)
    requires_acknowledgement = Column(Boolean, nullable=False, default=True)
    status = Column(String(20), nullable=False, default="active")
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    # Indexes
    __table_args__ = (
        Index('ix_esg_policies_esg_category_status', 'esg_category', 'status'),
        Index('ix_esg_policies_effective_date', 'effective_date'),
    )

    def __repr__(self):
        return f"<ESGPolicy(id={self.id}, title={self.title}, esg_category={self.esg_category})>"