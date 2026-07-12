/**
 * Environment Service
 */
import { apiClient } from "@/lib/api-client";
import type {
  CreateInitiativePayload,
  EnvironmentActivity,
  EnvironmentOverview,
  SustainabilityGoal,
} from "@/types/environment";

export async function getEnvironmentOverview(): Promise<EnvironmentOverview> {
  // Let's get summary dashboard stats to compute overview
  const summary = await apiClient.get<any>("/api/v1/dashboard/summary");

  return {
    score: summary.environment,
    carbon_saved: summary.carbon_saved,
    energy: 4500, // Default/fallback
    water: 1250, // Default/fallback
    waste: 480, // Default/fallback
  };
}

export async function getEnvironmentActivities(): Promise<
  EnvironmentActivity[]
> {
  // Map backend CarbonTransactions to frontend EnvironmentActivity items
  const transactions = await apiClient.get<any[]>(
    "/api/v1/carbon/transactions",
  );
  return transactions.map((t) => ({
    id: t.id,
    title: t.description || `Carbon Transaction: ${t.transaction_type}`,
    type: "carbon_reduction",
    status:
      t.status === "calculated"
        ? "approved"
        : t.status === "verified"
          ? "completed"
          : "pending",
    impact: Number(t.total_emissions) || 0,
    unit: t.unit || "kg",
    date: new Date(t.created_at).toLocaleDateString(),
    submittedBy: t.calculated_by || "System",
  }));
}

export async function getSustainabilityGoals(): Promise<SustainabilityGoal[]> {
  const goals = await apiClient.get<any[]>("/api/v1/carbon/goals");
  return goals.map((g) => ({
    id: g.id,
    title: g.name,
    target: Number(g.target_co2_kg) || 0,
    current: Number(g.current_co2_kg) || 0,
    unit: "kg",
    deadline: g.deadline,
    category: "carbon_reduction",
  }));
}

export async function createInitiative(
  payload: CreateInitiativePayload,
): Promise<EnvironmentActivity> {
  // Create a carbon transaction on the backend
  const res = await apiClient.post<any>("/api/v1/carbon/transactions", {
    transaction_type: "manual",
    quantity: payload.impact,
    unit: payload.unit || "kg",
    description: payload.title,
    auto_calculated: true,
  });

  return {
    id: res.id,
    title: res.description,
    type: "carbon_reduction",
    status: "pending",
    impact: Number(res.total_emissions) || 0,
    unit: res.unit || "kg",
    date: new Date().toLocaleDateString(),
    submittedBy: "Current User",
  };
}
