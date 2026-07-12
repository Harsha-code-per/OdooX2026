from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Enum as SQLEnum, Numeric, Text, Index, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from enum import Enum
import uuid
from app.database import Base

class CarbonTransactionType(str, Enum):
    purchase = "purchase"
    manufacturing = "manufacturing"
    expense = "expense"
    fleet = "fleet"
    manual = "manual"

class CarbonTransactionStatus(str, Enum):
    pending = "pending"
    calculated = "calculated"
    verified = "verified"
    failed = "failed"

class CarbonTransaction(Base):
    __tablename__ = "carbon_transactions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True, index=True)  # Nullable for system-level transactions
    transaction_type = Column(SQLEnum(CarbonTransactionType), nullable=False)
    status = Column(SQLEnum(CarbonTransactionStatus), nullable=False, default=CarbonTransactionStatus.pending)

    # Source reference
    source_type = Column(String(50), nullable=True)  # 'purchase', 'manufacturing', 'expense', 'fleet'
    source_id = Column(UUID(as_uuid=True), nullable=True, index=True)

    # Emission data
    emission_factor_id = Column(UUID(as_uuid=True), ForeignKey("emission_factors.id"), nullable=True, index=True)
    quantity = Column(Numeric(10, 2), nullable=False, default=0)  # Amount in kg, km, kWh, etc.
    unit = Column(String(20), nullable=False)  # 'kg', 'km', 'kWh', etc.
    total_emissions = Column(Numeric(10, 2), nullable=False, default=0)  # CO2e in kg

    # Additional data
    description = Column(Text, nullable=True)
    calculation_date = Column(DateTime(timezone=True), nullable=True)
    calculated_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    verified_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    verified_at = Column(DateTime(timezone=True), nullable=True)
    error_message = Column(Text, nullable=True)

    # Auto-calculation flags
    auto_calculated = Column(Boolean, nullable=False, default=False)
    auto_calculation_attempted = Column(Boolean, nullable=False, default=False)
    auto_calculation_error = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationships
    user = relationship("User", foreign_keys=[user_id], backref="carbon_transactions")
    emission_factor = relationship("EmissionFactor", backref="carbon_transactions")
    calculator = relationship("User", foreign_keys=[calculated_by], backref="calculated_emissions")
    verifier = relationship("User", foreign_keys=[verified_by], backref="verified_emissions")

    # Indexes
    __table_args__ = (
        Index('ix_carbon_transactions_user_id', 'user_id'),
        Index('ix_carbon_transactions_transaction_type', 'transaction_type'),
        Index('ix_carbon_transactions_status', 'status'),
        Index('ix_carbon_transactions_source_type_id', 'source_type', 'source_id'),
        Index('ix_carbon_transactions_emission_factor_id', 'emission_factor_id'),
        Index('ix_carbon_transactions_created_at', 'created_at'),
    )

    def __repr__(self):
        return f"<CarbonTransaction(id={self.id}, type={self.transaction_type}, emissions={self.total_emissions})>"

class Purchase(Base):
    __tablename__ = "purchases"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    department_id = Column(UUID(as_uuid=True), ForeignKey("departments.id"), nullable=True, index=True)

    # Purchase details
    purchase_order_number = Column(String(100), nullable=True)
    vendor_name = Column(String(255), nullable=False)
    vendor_id = Column(String(100), nullable=True)
    purchase_date = Column(DateTime(timezone=True), nullable=False)
    total_amount = Column(Numeric(12, 2), nullable=False, default=0)
    currency = Column(String(3), nullable=False, default="USD")

    # Carbon data
    material_weight_kg = Column(Numeric(10, 2), nullable=True)
    material_type = Column(String(100), nullable=True)
    shipping_distance_km = Column(Numeric(10, 2), nullable=True)
    shipping_method = Column(String(50), nullable=True)  # 'air', 'sea', 'ground', 'rail'

    # Carbon calculation
    carbon_transaction_id = Column(UUID(as_uuid=True), ForeignKey("carbon_transactions.id"), nullable=True, index=True)
    carbon_emissions_calculated = Column(Boolean, nullable=False, default=False)

    # Status
    status = Column(String(20), nullable=False, default="pending")  # 'pending', 'approved', 'received', 'cancelled'

    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationships
    user = relationship("User", backref="purchases")
    department = relationship("Department", backref="purchases")
    carbon_transaction = relationship("CarbonTransaction", backref="purchases")

    # Indexes
    __table_args__ = (
        Index('ix_purchases_user_id', 'user_id'),
        Index('ix_purchases_department_id', 'department_id'),
        Index('ix_purchases_purchase_date', 'purchase_date'),
        Index('ix_purchases_status', 'status'),
        Index('ix_purchases_carbon_transaction_id', 'carbon_transaction_id'),
    )

    def __repr__(self):
        return f"<Purchase(id={self.id}, vendor={self.vendor_name}, amount={self.total_amount})>"

class Manufacturing(Base):
    __tablename__ = "manufacturing"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    facility_id = Column(UUID(as_uuid=True), nullable=True, index=True)

    # Manufacturing details
    batch_number = Column(String(100), nullable=True)
    product_type = Column(String(255), nullable=False)
    production_date = Column(DateTime(timezone=True), nullable=False)
    quantity_produced = Column(Numeric(10, 2), nullable=False, default=0)
    unit = Column(String(20), nullable=False)  # 'kg', 'liters', 'units', etc.

    # Energy consumption
    electricity_kwh = Column(Numeric(10, 2), nullable=True)
    natural_gas_kwh = Column(Numeric(10, 2), nullable=True)
    water_liters = Column(Numeric(10, 2), nullable=True)

    # Carbon calculation
    carbon_transaction_id = Column(UUID(as_uuid=True), ForeignKey("carbon_transactions.id"), nullable=True, index=True)
    carbon_emissions_calculated = Column(Boolean, nullable=False, default=False)

    # Status
    status = Column(String(20), nullable=False, default="in_progress")  # 'planned', 'in_progress', 'completed', 'cancelled'

    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationships
    user = relationship("User", backref="manufacturing_records")
    carbon_transaction = relationship("CarbonTransaction", backref="manufacturing_records")

    # Indexes
    __table_args__ = (
        Index('ix_manufacturing_user_id', 'user_id'),
        Index('ix_manufacturing_facility_id', 'facility_id'),
        Index('ix_manufacturing_production_date', 'production_date'),
        Index('ix_manufacturing_status', 'status'),
        Index('ix_manufacturing_carbon_transaction_id', 'carbon_transaction_id'),
    )

    def __repr__(self):
        return f"<Manufacturing(id={self.id}, product={self.product_type}, quantity={self.quantity_produced})>"

class Expense(Base):
    __tablename__ = "expenses"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    department_id = Column(UUID(as_uuid=True), ForeignKey("departments.id"), nullable=True, index=True)

    # Expense details
    expense_report_number = Column(String(100), nullable=True)
    expense_type = Column(String(50), nullable=False)  # 'travel', 'meals', 'supplies', 'utilities', 'maintenance'
    expense_date = Column(DateTime(timezone=True), nullable=False)
    amount = Column(Numeric(12, 2), nullable=False, default=0)
    currency = Column(String(3), nullable=False, default="USD")

    # Carbon-relevant data
    travel_distance_km = Column(Numeric(10, 2), nullable=True)
    travel_method = Column(String(50), nullable=True)  # 'air', 'car', 'train', 'bus', etc.
    accommodation_nights = Column(Integer, nullable=True)

    # Carbon calculation
    carbon_transaction_id = Column(UUID(as_uuid=True), ForeignKey("carbon_transactions.id"), nullable=True, index=True)
    carbon_emissions_calculated = Column(Boolean, nullable=False, default=False)

    # Status
    status = Column(String(20), nullable=False, default="pending")  # 'pending', 'approved', 'rejected', 'paid'

    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationships
    user = relationship("User", backref="expenses")
    department = relationship("Department", backref="expenses")
    carbon_transaction = relationship("CarbonTransaction", backref="expenses")

    # Indexes
    __table_args__ = (
        Index('ix_expenses_user_id', 'user_id'),
        Index('ix_expenses_department_id', 'department_id'),
        Index('ix_expenses_expense_type', 'expense_type'),
        Index('ix_expenses_expense_date', 'expense_date'),
        Index('ix_expenses_status', 'status'),
        Index('ix_expenses_carbon_transaction_id', 'carbon_transaction_id'),
    )

    def __repr__(self):
        return f"<Expense(id={self.id}, type={self.expense_type}, amount={self.amount})>"

class Fleet(Base):
    __tablename__ = "fleet"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True, index=True)  # Driver/assignee
    vehicle_id = Column(String(100), nullable=True, index=True)

    # Vehicle details
    vehicle_type = Column(String(50), nullable=False)  # 'car', 'truck', 'van', 'motorcycle', 'electric_vehicle'
    make = Column(String(100), nullable=True)
    model = Column(String(100), nullable=True)
    year = Column(Integer, nullable=True)
    fuel_type = Column(String(50), nullable=True)  # 'gasoline', 'diesel', 'electric', 'hybrid'

    # Usage data
    record_date = Column(DateTime(timezone=True), nullable=False)
    distance_km = Column(Numeric(10, 2), nullable=False, default=0)
    fuel_consumed_liters = Column(Numeric(10, 2), nullable=True)
    electricity_kwh = Column(Numeric(10, 2), nullable=True)

    # Carbon calculation
    carbon_transaction_id = Column(UUID(as_uuid=True), ForeignKey("carbon_transactions.id"), nullable=True, index=True)
    carbon_emissions_calculated = Column(Boolean, nullable=False, default=False)

    # Status
    status = Column(String(20), nullable=False, default="active")  # 'active', 'maintenance', 'retired', 'accident'

    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationships
    user = relationship("User", backref="fleet_records")
    carbon_transaction = relationship("CarbonTransaction", backref="fleet_records")

    # Indexes
    __table_args__ = (
        Index('ix_fleet_user_id', 'user_id'),
        Index('ix_fleet_vehicle_id', 'vehicle_id'),
        Index('ix_fleet_record_date', 'record_date'),
        Index('ix_fleet_vehicle_type', 'vehicle_type'),
        Index('ix_fleet_status', 'status'),
        Index('ix_fleet_carbon_transaction_id', 'carbon_transaction_id'),
    )

    def __repr__(self):
        return f"<Fleet(id={self.id}, vehicle_type={self.vehicle_type}, distance={self.distance_km})>"