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
import { apiClient } from "@/lib/api-client";
import type {
  ActivityItem,
  DashboardCharts,
  DashboardSummary,
  Insight,
  LeaderboardEntry,
} from "@/types/dashboard";

export async function getDashboardSummary(): Promise<DashboardSummary> {
  return apiClient.get<DashboardSummary>("/api/v1/dashboard/summary");
}

export async function getDashboardCharts(): Promise<DashboardCharts> {
  return apiClient.get<DashboardCharts>("/api/v1/dashboard/charts");
}

export async function getDashboardActivity(): Promise<ActivityItem[]> {
  return apiClient.get<ActivityItem[]>("/api/v1/dashboard/activity");
}

export async function getDashboardInsights(): Promise<Insight[]> {
  return apiClient.get<Insight[]>("/api/v1/dashboard/insights");
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  return apiClient.get<LeaderboardEntry[]>("/api/v1/rewards/leaderboard");
}
