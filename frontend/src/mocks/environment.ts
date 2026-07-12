/**
 * Mock Environment Data
 */
import type {
  EnvironmentActivity,
  EnvironmentOverview,
  SustainabilityGoal,
} from "@/types/environment";

export const mockEnvironmentOverview: EnvironmentOverview = {
  score: 82,
  carbon_saved: 140,
  energy: 340,
  water: 500,
  waste: 75,
};

export const mockEnvironmentActivities: EnvironmentActivity[] = [
  {
    id: "env-1",
    title: "Solar panel installation",
    type: "renewable_energy",
    date: "2026-07-01",
    impact: 25,
    unit: "kg CO₂",
    status: "approved",
    submittedBy: "Engineering",
  },
  {
    id: "env-2",
    title: "Paper reduction initiative",
    type: "waste_reduction",
    date: "2026-07-05",
    impact: 12,
    unit: "kg",
    status: "approved",
    submittedBy: "Finance",
  },
  {
    id: "env-3",
    title: "LED lighting upgrade",
    type: "energy_saving",
    date: "2026-07-08",
    impact: 18,
    unit: "kWh",
    status: "pending",
    submittedBy: "Operations",
  },
  {
    id: "env-4",
    title: "Rainwater harvesting",
    type: "water_conservation",
    date: "2026-07-10",
    impact: 500,
    unit: "liters",
    status: "approved",
    submittedBy: "HR",
  },
];

export const mockSustainabilityGoals: SustainabilityGoal[] = [
  {
    id: "goal-1",
    title: "Reduce Carbon Emissions",
    current: 120,
    target: 200,
    unit: "kg CO₂",
    deadline: "2026-12-31",
    category: "carbon_reduction",
  },
  {
    id: "goal-2",
    title: "Energy Reduction",
    current: 340,
    target: 500,
    unit: "kWh",
    deadline: "2026-12-31",
    category: "energy_saving",
  },
  {
    id: "goal-3",
    title: "Water Conservation",
    current: 500,
    target: 1000,
    unit: "liters",
    deadline: "2026-12-31",
    category: "water_conservation",
  },
];
