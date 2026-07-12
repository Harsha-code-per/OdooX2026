/**
 * Environment Service
 */
import { delay } from "@/lib/helpers";
import {
  mockEnvironmentActivities,
  mockEnvironmentOverview,
  mockSustainabilityGoals,
} from "@/mocks/environment";
import type {
  CreateInitiativePayload,
  EnvironmentActivity,
  EnvironmentOverview,
  SustainabilityGoal,
} from "@/types/environment";

const SIMULATED_DELAY = 600;

export async function getEnvironmentOverview(): Promise<EnvironmentOverview> {
  await delay(SIMULATED_DELAY);
  return mockEnvironmentOverview;
}

export async function getEnvironmentActivities(): Promise<
  EnvironmentActivity[]
> {
  await delay(SIMULATED_DELAY);
  return mockEnvironmentActivities;
}

export async function getSustainabilityGoals(): Promise<SustainabilityGoal[]> {
  await delay(SIMULATED_DELAY);
  return mockSustainabilityGoals;
}

export async function createInitiative(
  payload: CreateInitiativePayload,
): Promise<EnvironmentActivity> {
  await delay(800);
  return {
    id: `env-${Date.now()}`,
    ...payload,
    status: "pending",
    submittedBy: "Current User",
  };
}
