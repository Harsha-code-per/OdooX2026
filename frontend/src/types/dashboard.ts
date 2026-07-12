/**
 * Dashboard Types
 *
 * Mirror dashboard response shapes from 04-api-contract.md:
 * GET /dashboard/summary, GET /dashboard/charts, GET /dashboard/activity.
 */

/* ─── Summary (KPI Cards) ──────────────────────────────────────────────────── */
export interface DashboardSummary {
  overall_esg: number;
  environment: number;
  social: number;
  governance: number;
  carbon_saved: number;
  employees: number;
  departments: number;
  pending_approvals: number;
  active_challenges: number;
}

/* ─── Chart Data ───────────────────────────────────────────────────────────── */
export interface DashboardCharts {
  monthly_esg: MonthlyDataPoint[];
  carbon_trend: MonthlyDataPoint[];
  department_scores: DepartmentScorePoint[];
  participation: MonthlyDataPoint[];
}

export interface MonthlyDataPoint {
  month: string;
  value: number;
}

export interface DepartmentScorePoint {
  department: string;
  score: number;
  environmental?: number;
  social?: number;
  governance?: number;
}

/* ─── Activity Feed ────────────────────────────────────────────────────────── */
export type ActivityType =
  | "approval"
  | "invitation"
  | "challenge"
  | "policy"
  | "report"
  | "department"
  | "member";

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  time: string;
  actor?: string;
  avatar?: string;
}

/* ─── Insight / Recommendation ─────────────────────────────────────────────── */
export type InsightSeverity = "info" | "warning" | "critical" | "success";

export interface Insight {
  id: string;
  message: string;
  severity: InsightSeverity;
  cta?: string;
  ctaHref?: string;
}

/* ─── Leaderboard ──────────────────────────────────────────────────────────── */
export interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  department?: string;
  avatar?: string;
  trend?: "up" | "down" | "stable";
}

/* ─── KPI Trend ────────────────────────────────────────────────────────────── */
export type TrendDirection = "up" | "down" | "stable";

export interface KPIMetric {
  value: number;
  trend: TrendDirection;
  change: number /* percentage change */;
  changeLabel?: string;
}
