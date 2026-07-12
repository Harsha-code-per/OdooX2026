/**
 * Carbon Emission Service
 *
 * Service functions for carbon emission tracking and auto-calculation
 */

import { apiClient } from "@/lib/api-client";
import type {
  CarbonTransaction,
  Purchase,
  Manufacturing,
  Expense,
  Fleet,
  AutoCalculationResponse,
  CarbonTransactionCreate,
  PurchaseCreate,
  ManufacturingCreate,
  ExpenseCreate,
  FleetCreate,
} from "@/types/carbon";

const CARBON_BASE = "/api/v1/carbon";

export const carbonService = {
  // Carbon Transactions
  async getCarbonTransactions(params?: {
    transaction_type?: string;
    status?: string;
    skip?: number;
    limit?: number;
  }): Promise<CarbonTransaction[]> {
    const queryParams = new URLSearchParams();
    if (params?.transaction_type) queryParams.append("transaction_type", params.transaction_type);
    if (params?.status) queryParams.append("status", params.status);
    if (params?.skip !== undefined) queryParams.append("skip", params.skip.toString());
    if (params?.limit !== undefined) queryParams.append("limit", params.limit.toString());

    const endpoint = `${CARBON_BASE}/transactions${queryParams.toString() ? `?${queryParams}` : ""}`;
    return apiClient.get<CarbonTransaction[]>(endpoint);
  },

  async createCarbonTransaction(transaction: CarbonTransactionCreate): Promise<CarbonTransaction> {
    return apiClient.post<CarbonTransaction>(`${CARBON_BASE}/transactions`, transaction);
  },

  async updateCarbonTransaction(
    transactionId: string,
    update: Partial<CarbonTransactionCreate>
  ): Promise<CarbonTransaction> {
    return apiClient.put<CarbonTransaction>(`${CARBON_BASE}/transactions/${transactionId}`, update);
  },

  // Purchases
  async getPurchases(params?: {
    status?: string;
    skip?: number;
    limit?: number;
  }): Promise<Purchase[]> {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append("status", params.status);
    if (params?.skip !== undefined) queryParams.append("skip", params.skip.toString());
    if (params?.limit !== undefined) queryParams.append("limit", params.limit.toString());

    const endpoint = `${CARBON_BASE}/purchases${queryParams.toString() ? `?${queryParams}` : ""}`;
    return apiClient.get<Purchase[]>(endpoint);
  },

  async createPurchase(purchase: PurchaseCreate): Promise<Purchase> {
    return apiClient.post<Purchase>(`${CARBON_BASE}/purchases`, purchase);
  },

  async updatePurchase(
    purchaseId: string,
    update: Partial<PurchaseCreate>
  ): Promise<Purchase> {
    return apiClient.put<Purchase>(`${CARBON_BASE}/purchases/${purchaseId}`, update);
  },

  // Manufacturing
  async getManufacturingRecords(params?: {
    status?: string;
    skip?: number;
    limit?: number;
  }): Promise<Manufacturing[]> {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append("status", params.status);
    if (params?.skip !== undefined) queryParams.append("skip", params.skip.toString());
    if (params?.limit !== undefined) queryParams.append("limit", params.limit.toString());

    const endpoint = `${CARBON_BASE}/manufacturing${queryParams.toString() ? `?${queryParams}` : ""}`;
    return apiClient.get<Manufacturing[]>(endpoint);
  },

  async createManufacturingRecord(manufacturing: ManufacturingCreate): Promise<Manufacturing> {
    return apiClient.post<Manufacturing>(`${CARBON_BASE}/manufacturing`, manufacturing);
  },

  // Expenses
  async getExpenses(params?: {
    expense_type?: string;
    status?: string;
    skip?: number;
    limit?: number;
  }): Promise<Expense[]> {
    const queryParams = new URLSearchParams();
    if (params?.expense_type) queryParams.append("expense_type", params.expense_type);
    if (params?.status) queryParams.append("status", params.status);
    if (params?.skip !== undefined) queryParams.append("skip", params.skip.toString());
    if (params?.limit !== undefined) queryParams.append("limit", params.limit.toString());

    const endpoint = `${CARBON_BASE}/expenses${queryParams.toString() ? `?${queryParams}` : ""}`;
    return apiClient.get<Expense[]>(endpoint);
  },

  async createExpense(expense: ExpenseCreate): Promise<Expense> {
    return apiClient.post<Expense>(`${CARBON_BASE}/expenses`, expense);
  },

  async updateExpense(
    expenseId: string,
    update: Partial<ExpenseCreate>
  ): Promise<Expense> {
    return apiClient.put<Expense>(`${CARBON_BASE}/expenses/${expenseId}`, update);
  },

  // Fleet
  async getFleetRecords(params?: {
    vehicle_type?: string;
    status?: string;
    skip?: number;
    limit?: number;
  }): Promise<Fleet[]> {
    const queryParams = new URLSearchParams();
    if (params?.vehicle_type) queryParams.append("vehicle_type", params.vehicle_type);
    if (params?.status) queryParams.append("status", params.status);
    if (params?.skip !== undefined) queryParams.append("skip", params.skip.toString());
    if (params?.limit !== undefined) queryParams.append("limit", params.limit.toString());

    const endpoint = `${CARBON_BASE}/fleet${queryParams.toString() ? `?${queryParams}` : ""}`;
    return apiClient.get<Fleet[]>(endpoint);
  },

  async createFleetRecord(fleet: FleetCreate): Promise<Fleet> {
    return apiClient.post<Fleet>(`${CARBON_BASE}/fleet`, fleet);
  },

  async updateFleetRecord(
    fleetId: string,
    update: Partial<FleetCreate>
  ): Promise<Fleet> {
    return apiClient.put<Fleet>(`${CARBON_BASE}/fleet/${fleetId}`, update);
  },

  // Auto-Calculation
  async triggerAutoCalculation(sourceType: string, sourceId: string): Promise<AutoCalculationResponse> {
    return apiClient.post<AutoCalculationResponse>(
      `${CARBON_BASE}/auto-calculate?source_type=${sourceType}&source_id=${sourceId}`
    );
  },

  async triggerAutoCalculationAll(sourceType: string): Promise<AutoCalculationResponse> {
    return apiClient.post<AutoCalculationResponse>(
      `${CARBON_BASE}/auto-calculate-all?source_type=${sourceType}`
    );
  },
};