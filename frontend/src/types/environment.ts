/**
 * Environmental Module Types
 *
 * Mirror environment response shapes from 04-api-contract.md:
 * GET /environment/overview, GET /environment/activities.
 */

export interface EnvironmentOverview {
  score: number;
  carbon_saved: number;
  energy: number;
  water: number;
  waste?: number;
}

export interface EnvironmentActivity {
  id: string;
  title: string;
  type: EnvironmentActivityType;
  date: string;
  impact: number;
  unit: string;
  status: EnvironmentActivityStatus;
  submittedBy?: string;
}

export type EnvironmentActivityType =
  | "carbon_reduction"
  | "energy_saving"
  | "water_conservation"
  | "waste_reduction"
  | "renewable_energy"
  | "other";

export type EnvironmentActivityStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "completed";

export interface SustainabilityGoal {
  id: string;
  title: string;
  current: number;
  target: number;
  unit: string;
  deadline: string;
  category: EnvironmentActivityType;
}

export interface CreateInitiativePayload {
  title: string;
  type: EnvironmentActivityType;
  impact: number;
  unit: string;
  date: string;
  description?: string;
}
