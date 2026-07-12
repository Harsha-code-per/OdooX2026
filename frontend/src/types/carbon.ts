/**
 * Carbon Emission Module Types
 *
 * Types for carbon emission tracking and auto-calculation
 */

export interface CarbonTransaction {
  id: string;
  user_id?: string;
  transaction_type: CarbonTransactionType;
  status: CarbonTransactionStatus;
  source_type?: string;
  source_id?: string;
  emission_factor_id?: string;
  quantity: number;
  unit: string;
  total_emissions: number;
  description?: string;
  calculation_date?: string;
  calculated_by?: string;
  verified_by?: string;
  verified_at?: string;
  error_message?: string;
  auto_calculated: boolean;
  auto_calculation_attempted: boolean;
  auto_calculation_error?: string;
  created_at: string;
  updated_at: string;
}

export type CarbonTransactionType =
  | "purchase"
  | "manufacturing"
  | "expense"
  | "fleet"
  | "manual";

export type CarbonTransactionStatus =
  | "pending"
  | "calculated"
  | "verified"
  | "failed";

export interface Purchase {
  id: string;
  user_id: string;
  department_id?: string;
  purchase_order_number?: string;
  vendor_name: string;
  vendor_id?: string;
  purchase_date: string;
  total_amount: number;
  currency: string;
  material_weight_kg?: number;
  material_type?: string;
  shipping_distance_km?: number;
  shipping_method?: string;
  carbon_transaction_id?: string;
  carbon_emissions_calculated: boolean;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Manufacturing {
  id: string;
  user_id: string;
  facility_id?: string;
  batch_number?: string;
  product_type: string;
  production_date: string;
  quantity_produced: number;
  unit: string;
  electricity_kwh?: number;
  natural_gas_kwh?: number;
  water_liters?: number;
  carbon_transaction_id?: string;
  carbon_emissions_calculated: boolean;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Expense {
  id: string;
  user_id: string;
  department_id?: string;
  expense_report_number?: string;
  expense_type: string;
  expense_date: string;
  amount: number;
  currency: string;
  travel_distance_km?: number;
  travel_method?: string;
  accommodation_nights?: number;
  carbon_transaction_id?: string;
  carbon_emissions_calculated: boolean;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Fleet {
  id: string;
  user_id?: string;
  vehicle_id?: string;
  vehicle_type: string;
  make?: string;
  model?: string;
  year?: number;
  fuel_type?: string;
  record_date: string;
  distance_km: number;
  fuel_consumed_liters?: number;
  electricity_kwh?: number;
  carbon_transaction_id?: string;
  carbon_emissions_calculated: boolean;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface AutoCalculationResponse {
  success: boolean;
  calculated_count: number;
  failed_count: number;
  errors: string[];
  total_emissions?: number;
}

// Create/Update types
export interface CarbonTransactionCreate {
  user_id?: string;
  transaction_type: CarbonTransactionType;
  quantity: number;
  unit: string;
  description?: string;
  emission_factor_id?: string;
  auto_calculated?: boolean;
  source_type?: string;
  source_id?: string;
}

export interface PurchaseCreate {
  user_id: string;
  department_id?: string;
  vendor_name: string;
  vendor_id?: string;
  purchase_order_number?: string;
  purchase_date: string;
  total_amount: number;
  currency?: string;
  material_weight_kg?: number;
  material_type?: string;
  shipping_distance_km?: number;
  shipping_method?: string;
}

export interface ManufacturingCreate {
  user_id: string;
  facility_id?: string;
  batch_number?: string;
  product_type: string;
  production_date: string;
  quantity_produced: number;
  unit: string;
  electricity_kwh?: number;
  natural_gas_kwh?: number;
  water_liters?: number;
}

export interface ExpenseCreate {
  user_id: string;
  department_id?: string;
  expense_report_number?: string;
  expense_type: string;
  expense_date: string;
  amount: number;
  currency?: string;
  travel_distance_km?: number;
  travel_method?: string;
  accommodation_nights?: number;
}

export interface FleetCreate {
  user_id?: string;
  vehicle_id?: string;
  vehicle_type: string;
  make?: string;
  model?: string;
  year?: number;
  fuel_type?: string;
  record_date: string;
  distance_km: number;
  fuel_consumed_liters?: number;
  electricity_kwh?: number;
}
