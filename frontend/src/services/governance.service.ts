/**
 * Governance Service
 */
import { delay } from "@/lib/helpers";
import {
  mockAudits,
  mockGovernanceOverview,
  mockPolicies,
} from "@/mocks/governance";
import type {
  Audit,
  CreatePolicyPayload,
  GovernanceOverview,
  Policy,
} from "@/types/governance";

const SIMULATED_DELAY = 600;

export async function getGovernanceOverview(): Promise<GovernanceOverview> {
  await delay(SIMULATED_DELAY);
  return mockGovernanceOverview;
}

export async function getPolicies(): Promise<Policy[]> {
  await delay(SIMULATED_DELAY);
  return mockPolicies;
}

export async function getAudits(): Promise<Audit[]> {
  await delay(SIMULATED_DELAY);
  return mockAudits;
}

export async function createPolicy(
  payload: CreatePolicyPayload,
): Promise<Policy> {
  await delay(800);
  return {
    id: `pol-${Date.now()}`,
    ...payload,
    status: "draft",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
