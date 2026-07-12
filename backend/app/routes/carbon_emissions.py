from fastapi import APIRouter, Depends, HTTPException, status, Query, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, or_
from typing import List, Optional
from uuid import UUID
from datetime import datetime
from decimal import Decimal

from app.database import get_db
from app.models.carbon_emission import (
    CarbonTransaction, Purchase, Manufacturing, Expense, Fleet,
    CarbonTransactionType, CarbonTransactionStatus
)
from app.models.emission_factor import EmissionFactor
from app.models.user import User
from app.schemas.carbon_emission import (
    CarbonTransactionCreate, CarbonTransactionUpdate, CarbonTransactionResponse,
    PurchaseCreate, PurchaseUpdate, PurchaseResponse,
    ManufacturingCreate, ManufacturingUpdate, ManufacturingResponse,
    ExpenseCreate, ExpenseUpdate, ExpenseResponse,
    FleetCreate, FleetUpdate, FleetResponse,
    AutoCalculationResponse
)
from app.dependencies.auth import get_current_user, get_current_admin_user

router = APIRouter(prefix="/carbon", tags=["Carbon Emissions"])

# Helper function to calculate emissions
async def calculate_emissions(
    db: AsyncSession,
    source_type: str,
    source_id: UUID,
    quantity: Decimal,
    unit: str
) -> tuple[Decimal, Optional[UUID]]:
    """Calculate carbon emissions based on source type and quantity"""

    # Get appropriate emission factor based on source type
    if source_type == "purchase":
        # For purchases, look for material-related emission factors
        result = await db.execute(
            select(EmissionFactor).where(EmissionFactor.factor_type == "material")
        )
    elif source_type == "manufacturing":
        # For manufacturing, look for energy-related factors
        result = await db.execute(
            select(EmissionFactor).where(EmissionFactor.factor_type == "energy")
        )
    elif source_type == "expense":
        # For expenses, look for travel-related factors
        result = await db.execute(
            select(EmissionFactor).where(EmissionFactor.factor_type.in_(["travel", "transport"]))
        )
    elif source_type == "fleet":
        # For fleet, look for vehicle-related factors
        result = await db.execute(
            select(EmissionFactor).where(EmissionFactor.factor_type == "vehicle")
        )
    else:
        return Decimal(0), None

    emission_factor = result.scalar_one_or_none()
    if not emission_factor:
        return Decimal(0), None

    # Calculate emissions: quantity * emission_factor * conversion_factor
    # This is a simplified calculation - you'd want more sophisticated logic
    emissions = quantity * emission_factor.emission_factor

    return emissions, emission_factor.id

# Background task for auto-calculation
async def auto_calculate_carbon_emissions(db: AsyncSession, source_type: str, source_id: UUID):
    """Automatically calculate carbon emissions for a source record"""

    try:
        if source_type == "purchase":
            result = await db.execute(select(Purchase).where(Purchase.id == source_id))
            source = result.scalar_one_or_none()
            if not source:
                return

            quantity = Decimal(0)
            unit = "kg"

            # Calculate based on material weight and shipping
            if source.material_weight_kg:
                quantity += source.material_weight_kg
            if source.shipping_distance_km:
                # Add shipping emissions
                quantity += source.shipping_distance_km * Decimal("0.1")  # Simplified conversion
                unit = "kg_co2e"

        elif source_type == "manufacturing":
            result = await db.execute(select(Manufacturing).where(Manufacturing.id == source_id))
            source = result.scalar_one_or_none()
            if not source:
                return

            quantity = Decimal(0)
            unit = "kwh"

            # Sum energy consumption
            if source.electricity_kwh:
                quantity += source.electricity_kwh
            if source.natural_gas_kwh:
                quantity += source.natural_gas_kwh

        elif source_type == "expense":
            result = await db.execute(select(Expense).where(Expense.id == source_id))
            source = result.scalar_one_or_none()
            if not source:
                return

            quantity = Decimal(0)
            unit = "km"

            if source.travel_distance_km:
                quantity = source.travel_distance_km

        elif source_type == "fleet":
            result = await db.execute(select(Fleet).where(Fleet.id == source_id))
            source = result.scalar_one_or_none()
            if not source:
                return

            quantity = source.distance_km
            unit = "km"

        else:
            return

        # Calculate emissions
        emissions, factor_id = await calculate_emissions(db, source_type, source_id, quantity, unit)

        # Create or update carbon transaction
        trans_result = await db.execute(
            select(CarbonTransaction).where(and_(
                CarbonTransaction.source_type == source_type,
                CarbonTransaction.source_id == source_id
            ))
        )
        existing_transaction = trans_result.scalar_one_or_none()

        if existing_transaction:
            existing_transaction.total_emissions = emissions
            existing_transaction.status = CarbonTransactionStatus.calculated
            existing_transaction.auto_calculated = True
            existing_transaction.auto_calculation_attempted = True
            existing_transaction.calculation_date = datetime.utcnow()
            if factor_id:
                existing_transaction.emission_factor_id = factor_id
        else:
            new_transaction = CarbonTransaction(
                source_type=source_type,
                source_id=source_id,
                transaction_type=CarbonTransactionType(source_type),
                quantity=quantity,
                unit=unit,
                total_emissions=emissions,
                emission_factor_id=factor_id,
                status=CarbonTransactionStatus.calculated,
                auto_calculated=True,
                auto_calculation_attempted=True,
                calculation_date=datetime.utcnow()
            )
            db.add(new_transaction)

        # Update source record
        if source_type == "purchase":
            source.carbon_emissions_calculated = True
        elif source_type == "manufacturing":
            source.carbon_emissions_calculated = True
        elif source_type == "expense":
            source.carbon_emissions_calculated = True
        elif source_type == "fleet":
            source.carbon_emissions_calculated = True

        await db.commit()

    except Exception as e:
        # Log error and update auto_calculation_error
        trans_result = await db.execute(
            select(CarbonTransaction).where(and_(
                CarbonTransaction.source_type == source_type,
                CarbonTransaction.source_id == source_id
            ))
        )
        existing_transaction = trans_result.scalar_one_or_none()

        if existing_transaction:
            existing_transaction.auto_calculation_error = str(e)
            existing_transaction.auto_calculation_attempted = True
            await db.commit()

# Carbon Transaction Endpoints
@router.get("/transactions", response_model=List[CarbonTransactionResponse])
async def get_carbon_transactions(
    transaction_type: Optional[CarbonTransactionType] = None,
    status: Optional[CarbonTransactionStatus] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get carbon transactions (filtered by user access)"""
    query = select(CarbonTransaction)

    # Non-admin users can only see their own transactions
    if current_user.role.name != "admin":
        query = query.where(CarbonTransaction.user_id == current_user.id)

    if transaction_type:
        query = query.where(CarbonTransaction.transaction_type == transaction_type)
    if status:
        query = query.where(CarbonTransaction.status == status)

    query = query.order_by(CarbonTransaction.created_at.desc())
    query = query.offset(skip).limit(limit)

    result = await db.execute(query)
    transactions = result.scalars().all()

    return transactions

@router.post("/transactions", response_model=CarbonTransactionResponse, status_code=status.HTTP_201_CREATED)
async def create_carbon_transaction(
    transaction: CarbonTransactionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Create manual carbon transaction (Admin only)"""
    db_transaction = CarbonTransaction(**transaction.model_dump())
    db.add(db_transaction)

    await db.commit()
    await db.refresh(db_transaction)

    return db_transaction

@router.put("/transactions/{transaction_id}", response_model=CarbonTransactionResponse)
async def update_carbon_transaction(
    transaction_id: UUID,
    transaction_update: CarbonTransactionUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Update carbon transaction (Admin only)"""
    result = await db.execute(select(CarbonTransaction).where(CarbonTransaction.id == transaction_id))
    transaction = result.scalar_one_or_none()

    if not transaction:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Carbon transaction not found")

    # Update fields
    for field, value in transaction_update.model_dump(exclude_unset=True).items():
        setattr(transaction, field, value)

    await db.commit()
    await db.refresh(transaction)

    return transaction

# Purchase Endpoints
@router.get("/purchases", response_model=List[PurchaseResponse])
async def get_purchases(
    status: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get purchases (filtered by user access)"""
    query = select(Purchase)

    # Non-admin users can only see their own purchases
    if current_user.role.name != "admin":
        query = query.where(Purchase.user_id == current_user.id)

    if status:
        query = query.where(Purchase.status == status)

    query = query.order_by(Purchase.purchase_date.desc())
    query = query.offset(skip).limit(limit)

    result = await db.execute(query)
    purchases = result.scalars().all()

    return purchases

@router.post("/purchases", response_model=PurchaseResponse, status_code=status.HTTP_201_CREATED)
async def create_purchase(
    purchase: PurchaseCreate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create new purchase"""
    db_purchase = Purchase(**purchase.model_dump())

    if not db_purchase.user_id:
        db_purchase.user_id = current_user.id

    db.add(db_purchase)
    await db.flush()  # Get the ID

    # Trigger auto-calculation in background
    if db_purchase.id:
        background_tasks.add_task(auto_calculate_carbon_emissions, db, "purchase", db_purchase.id)

    await db.commit()
    await db.refresh(db_purchase)

    return db_purchase

@router.put("/purchases/{purchase_id}", response_model=PurchaseResponse)
async def update_purchase(
    purchase_id: UUID,
    purchase_update: PurchaseUpdate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update purchase"""
    result = await db.execute(select(Purchase).where(Purchase.id == purchase_id))
    purchase = result.scalar_one_or_none()

    if not purchase:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Purchase not found")

    # Check permissions
    if current_user.role.name != "admin" and purchase.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    # Update fields
    for field, value in purchase_update.model_dump(exclude_unset=True).items():
        setattr(purchase, field, value)

    # Re-trigger auto-calculation if carbon_emissions_calculated is being enabled
    if purchase_update.carbon_emissions_calculated and not purchase.carbon_emissions_calculated:
        background_tasks.add_task(auto_calculate_carbon_emissions, db, "purchase", purchase.id)

    await db.commit()
    await db.refresh(purchase)

    return purchase

# Manufacturing Endpoints
@router.get("/manufacturing", response_model=List[ManufacturingResponse])
async def get_manufacturing_records(
    status: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get manufacturing records (filtered by user access)"""
    query = select(Manufacturing)

    # Non-admin users can only see their own records
    if current_user.role.name != "admin":
        query = query.where(Manufacturing.user_id == current_user.id)

    if status:
        query = query.where(Manufacturing.status == status)

    query = query.order_by(Manufacturing.production_date.desc())
    query = query.offset(skip).limit(limit)

    result = await db.execute(query)
    records = result.scalars().all()

    return records

@router.post("/manufacturing", response_model=ManufacturingResponse, status_code=status.HTTP_201_CREATED)
async def create_manufacturing_record(
    manufacturing: ManufacturingCreate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create new manufacturing record"""
    db_manufacturing = Manufacturing(**manufacturing.model_dump())

    if not db_manufacturing.user_id:
        db_manufacturing.user_id = current_user.id

    db.add(db_manufacturing)
    await db.flush()

    # Trigger auto-calculation in background
    if db_manufacturing.id:
        background_tasks.add_task(auto_calculate_carbon_emissions, db, "manufacturing", db_manufacturing.id)

    await db.commit()
    await db.refresh(db_manufacturing)

    return db_manufacturing

# Expense Endpoints
@router.get("/expenses", response_model=List[ExpenseResponse])
async def get_expenses(
    expense_type: Optional[str] = None,
    status: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get expenses (filtered by user access)"""
    query = select(Expense)

    # Non-admin users can only see their own expenses
    if current_user.role.name != "admin":
        query = query.where(Expense.user_id == current_user.id)

    if expense_type:
        query = query.where(Expense.expense_type == expense_type)
    if status:
        query = query.where(Expense.status == status)

    query = query.order_by(Expense.expense_date.desc())
    query = query.offset(skip).limit(limit)

    result = await db.execute(query)
    expenses = result.scalars().all()

    return expenses

@router.post("/expenses", response_model=ExpenseResponse, status_code=status.HTTP_201_CREATED)
async def create_expense(
    expense: ExpenseCreate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create new expense"""
    db_expense = Expense(**expense.model_dump())

    if not db_expense.user_id:
        db_expense.user_id = current_user.id

    db.add(db_expense)
    await db.flush()

    # Trigger auto-calculation in background
    if db_expense.id:
        background_tasks.add_task(auto_calculate_carbon_emissions, db, "expense", db_expense.id)

    await db.commit()
    await db.refresh(db_expense)

    return db_expense

# Fleet Endpoints
@router.get("/fleet", response_model=List[FleetResponse])
async def get_fleet_records(
    vehicle_type: Optional[str] = None,
    status: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get fleet records (filtered by user access)"""
    query = select(Fleet)

    # Non-admin users can only see their own records
    if current_user.role.name != "admin":
        query = query.where(Fleet.user_id == current_user.id)

    if vehicle_type:
        query = query.where(Fleet.vehicle_type == vehicle_type)
    if status:
        query = query.where(Fleet.status == status)

    query = query.order_by(Fleet.record_date.desc())
    query = query.offset(skip).limit(limit)

    result = await db.execute(query)
    records = result.scalars().all()

    return records

@router.post("/fleet", response_model=FleetResponse, status_code=status.HTTP_201_CREATED)
async def create_fleet_record(
    fleet: FleetCreate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create new fleet record"""
    db_fleet = Fleet(**fleet.model_dump())

    if not db_fleet.user_id:
        db_fleet.user_id = current_user.id

    db.add(db_fleet)
    await db.flush()

    # Trigger auto-calculation in background
    if db_fleet.id:
        background_tasks.add_task(auto_calculate_carbon_emissions, db, "fleet", db_fleet.id)

    await db.commit()
    await db.refresh(db_fleet)

    return db_fleet

# Auto-Calculation Endpoints
@router.post("/auto-calculate", response_model=AutoCalculationResponse)
async def trigger_auto_calculation(
    source_type: str = Query(..., regex="^(purchase|manufacturing|expense|fleet)$"),
    source_id: UUID = Query(...),
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Manually trigger auto-calculation for a specific record (Admin only)"""
    try:
        background_tasks.add_task(auto_calculate_carbon_emissions, db, source_type, source_id)

        return AutoCalculationResponse(
            success=True,
            calculated_count=1,
            failed_count=0,
            errors=[]
        )
    except Exception as e:
        return AutoCalculationResponse(
            success=False,
            calculated_count=0,
            failed_count=1,
            errors=[str(e)]
        )

@router.post("/auto-calculate-all", response_model=AutoCalculationResponse)
async def trigger_auto_calculation_all(
    source_type: str = Query(..., regex="^(purchase|manufacturing|expense|fleet)$"),
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Trigger auto-calculation for all records of a type (Admin only)"""
    calculated_count = 0
    failed_count = 0
    errors = []

    try:
        if source_type == "purchase":
            result = await db.execute(select(Purchase).where(Purchase.carbon_emissions_calculated == False))
            records = result.scalars().all()
        elif source_type == "manufacturing":
            result = await db.execute(select(Manufacturing).where(Manufacturing.carbon_emissions_calculated == False))
            records = result.scalars().all()
        elif source_type == "expense":
            result = await db.execute(select(Expense).where(Expense.carbon_emissions_calculated == False))
            records = result.scalars().all()
        elif source_type == "fleet":
            result = await db.execute(select(Fleet).where(Fleet.carbon_emissions_calculated == False))
            records = result.scalars().all()
        else:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid source type")

        for record in records:
            try:
                background_tasks.add_task(auto_calculate_carbon_emissions, db, source_type, record.id)
                calculated_count += 1
            except Exception as e:
                failed_count += 1
                errors.append(f"Record {record.id}: {str(e)}")

        return AutoCalculationResponse(
            success=failed_count == 0,
            calculated_count=calculated_count,
            failed_count=failed_count,
            errors=errors
        )

    except Exception as e:
        return AutoCalculationResponse(
            success=False,
            calculated_count=0,
            failed_count=1,
            errors=[str(e)]
        )