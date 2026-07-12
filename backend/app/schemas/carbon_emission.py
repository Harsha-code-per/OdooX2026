from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import datetime
from uuid import UUID
from enum import Enum
from decimal import Decimal

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

# Carbon Transaction Schemas
class CarbonTransactionBase(BaseModel):
    transaction_type: CarbonTransactionType
    quantity: Decimal = Field(..., ge=0, description="Amount in kg, km, kWh, etc.")
    unit: str = Field(..., min_length=1, max_length=20, description="kg, km, kWh, etc.")
    description: Optional[str] = None
    emission_factor_id: Optional[UUID] = None
    auto_calculated: bool = False

class CarbonTransactionCreate(CarbonTransactionBase):
    user_id: Optional[UUID] = None
    source_type: Optional[str] = None
    source_id: Optional[UUID] = None

class CarbonTransactionUpdate(BaseModel):
    status: Optional[CarbonTransactionStatus] = None
    total_emissions: Optional[Decimal] = None
    description: Optional[str] = None
    auto_calculated: Optional[bool] = None

class CarbonTransactionResponse(CarbonTransactionBase):
    id: UUID
    user_id: Optional[UUID]
    status: CarbonTransactionStatus
    source_type: Optional[str]
    source_id: Optional[UUID]
    total_emissions: Decimal
    calculation_date: Optional[datetime]
    calculated_by: Optional[UUID]
    verified_by: Optional[UUID]
    verified_at: Optional[datetime]
    error_message: Optional[str]
    auto_calculation_attempted: bool
    auto_calculation_error: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Purchase Schemas
class PurchaseBase(BaseModel):
    vendor_name: str = Field(..., min_length=1, max_length=255)
    vendor_id: Optional[str] = Field(None, max_length=100)
    purchase_order_number: Optional[str] = Field(None, max_length=100)
    purchase_date: datetime
    total_amount: Decimal = Field(..., ge=0)
    currency: str = Field(default="USD", min_length=3, max_length=3)
    material_weight_kg: Optional[Decimal] = Field(None, ge=0)
    material_type: Optional[str] = Field(None, max_length=100)
    shipping_distance_km: Optional[Decimal] = Field(None, ge=0)
    shipping_method: Optional[str] = Field(None, max_length=50)

class PurchaseCreate(PurchaseBase):
    user_id: UUID
    department_id: Optional[UUID] = None

class PurchaseUpdate(BaseModel):
    vendor_name: Optional[str] = Field(None, min_length=1, max_length=255)
    total_amount: Optional[Decimal] = Field(None, ge=0)
    status: Optional[str] = None
    carbon_emissions_calculated: Optional[bool] = None

class PurchaseResponse(PurchaseBase):
    id: UUID
    user_id: UUID
    department_id: Optional[UUID]
    status: str
    carbon_transaction_id: Optional[UUID]
    carbon_emissions_calculated: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Manufacturing Schemas
class ManufacturingBase(BaseModel):
    batch_number: Optional[str] = Field(None, max_length=100)
    product_type: str = Field(..., min_length=1, max_length=255)
    production_date: datetime
    quantity_produced: Decimal = Field(..., ge=0)
    unit: str = Field(..., min_length=1, max_length=20)
    electricity_kwh: Optional[Decimal] = Field(None, ge=0)
    natural_gas_kwh: Optional[Decimal] = Field(None, ge=0)
    water_liters: Optional[Decimal] = Field(None, ge=0)

class ManufacturingCreate(ManufacturingBase):
    user_id: UUID
    facility_id: Optional[UUID] = None

class ManufacturingUpdate(BaseModel):
    product_type: Optional[str] = Field(None, min_length=1, max_length=255)
    quantity_produced: Optional[Decimal] = Field(None, ge=0)
    status: Optional[str] = None
    carbon_emissions_calculated: Optional[bool] = None

class ManufacturingResponse(ManufacturingBase):
    id: UUID
    user_id: UUID
    facility_id: Optional[UUID]
    status: str
    carbon_transaction_id: Optional[UUID]
    carbon_emissions_calculated: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Expense Schemas
class ExpenseBase(BaseModel):
    expense_report_number: Optional[str] = Field(None, max_length=100)
    expense_type: str = Field(..., min_length=1, max_length=50)
    expense_date: datetime
    amount: Decimal = Field(..., ge=0)
    currency: str = Field(default="USD", min_length=3, max_length=3)
    travel_distance_km: Optional[Decimal] = Field(None, ge=0)
    travel_method: Optional[str] = Field(None, max_length=50)
    accommodation_nights: Optional[int] = Field(None, ge=0)

class ExpenseCreate(ExpenseBase):
    user_id: UUID
    department_id: Optional[UUID] = None

class ExpenseUpdate(BaseModel):
    expense_type: Optional[str] = Field(None, min_length=1, max_length=50)
    amount: Optional[Decimal] = Field(None, ge=0)
    status: Optional[str] = None
    carbon_emissions_calculated: Optional[bool] = None

class ExpenseResponse(ExpenseBase):
    id: UUID
    user_id: UUID
    department_id: Optional[UUID]
    status: str
    carbon_transaction_id: Optional[UUID]
    carbon_emissions_calculated: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Fleet Schemas
class FleetBase(BaseModel):
    vehicle_id: Optional[str] = Field(None, max_length=100)
    vehicle_type: str = Field(..., min_length=1, max_length=50)
    make: Optional[str] = Field(None, max_length=100)
    model: Optional[str] = Field(None, max_length=100)
    year: Optional[int] = Field(None, ge=1900, le=2100)
    fuel_type: Optional[str] = Field(None, max_length=50)
    record_date: datetime
    distance_km: Decimal = Field(..., ge=0)
    fuel_consumed_liters: Optional[Decimal] = Field(None, ge=0)
    electricity_kwh: Optional[Decimal] = Field(None, ge=0)

class FleetCreate(FleetBase):
    user_id: Optional[UUID] = None

class FleetUpdate(BaseModel):
    distance_km: Optional[Decimal] = Field(None, ge=0)
    fuel_consumed_liters: Optional[Decimal] = Field(None, ge=0)
    status: Optional[str] = None
    carbon_emissions_calculated: Optional[bool] = None

class FleetResponse(FleetBase):
    id: UUID
    user_id: Optional[UUID]
    status: str
    carbon_transaction_id: Optional[UUID]
    carbon_emissions_calculated: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Auto-Calculation Response
class AutoCalculationResponse(BaseModel):
    success: bool
    calculated_count: int
    failed_count: int
    errors: List[str] = []
    total_emissions: Optional[Decimal] = None