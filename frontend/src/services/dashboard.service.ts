/**
 * Dashboard Service
 *
 * Abstraction layer between React Query hooks and the API.
 *
 * Phase 1: Returns mock data (simulates network delay)
 * Phase 12: Replace mock imports with apiClient calls
 *
 * Components must NEVER call these functions directly.
 * They are consumed by React Query hooks only.
 */
import { delay } from "@/lib/helpers";
import {
  mockActivityFeed,
  mockDashboardCharts,
  mockDashboardSummary,
  mockInsights,
  mockLeaderboard,
} from "@/mocks/dashboard";
import type {
  ActivityItem,
  DashboardCharts,
  DashboardSummary,
  Insight,
  LeaderboardEntry,
} from "@/types/dashboard";

const SIMULATED_DELAY = 600; /* ms — realistic network simulation */

export async function getDashboardSummary(): Promise<DashboardSummary> {
  await delay(SIMULATED_DELAY);
  return mockDashboardSummary;
  /* Phase 12: return apiClient.get<DashboardSummary>(API_ENDPOINTS.DASHBOARD.SUMMARY) */
}

export async function getDashboardCharts(): Promise<DashboardCharts> {
  await delay(SIMULATED_DELAY);
  return mockDashboardCharts;
  /* Phase 12: return apiClient.get<DashboardCharts>(API_ENDPOINTS.DASHBOARD.CHARTS) */
}

export async function getDashboardActivity(): Promise<ActivityItem[]> {
  await delay(SIMULATED_DELAY);
  return mockActivityFeed;
  /* Phase 12: return apiClient.get<ActivityItem[]>(API_ENDPOINTS.DASHBOARD.ACTIVITY) */
}

export async function getDashboardInsights(): Promise<Insight[]> {
  await delay(SIMULATED_DELAY);
  return mockInsights;
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  await delay(SIMULATED_DELAY);
  return mockLeaderboard;
}
