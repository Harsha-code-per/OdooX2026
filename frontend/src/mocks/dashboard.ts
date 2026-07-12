/**
 * Mock Dashboard Data
 *
 * Mirrors GET /dashboard/summary, GET /dashboard/charts, GET /dashboard/activity.
 * Types are strictly aligned with src/types/dashboard.ts.
 *
 * Replace with real API calls in Phase 12 — Backend Integration.
 * Only service layer changes — hooks and components remain untouched.
 */
import type {
  ActivityItem,
  DashboardCharts,
  DashboardSummary,
  Insight,
  LeaderboardEntry,
} from "@/types/dashboard";

export const mockDashboardSummary: DashboardSummary = {
  overall_esg: 84,
  environment: 82,
  social: 87,
  governance: 83,
  carbon_saved: 120,
  employees: 145,
  departments: 8,
  pending_approvals: 3,
  active_challenges: 6,
};

export const mockDashboardCharts: DashboardCharts = {
  monthly_esg: [
    { month: "Jan", value: 72 },
    { month: "Feb", value: 75 },
    { month: "Mar", value: 74 },
    { month: "Apr", value: 78 },
    { month: "May", value: 80 },
    { month: "Jun", value: 81 },
    { month: "Jul", value: 84 },
  ],
  carbon_trend: [
    { month: "Jan", value: 40 },
    { month: "Feb", value: 55 },
    { month: "Mar", value: 60 },
    { month: "Apr", value: 72 },
    { month: "May", value: 88 },
    { month: "Jun", value: 104 },
    { month: "Jul", value: 120 },
  ],
  department_scores: [
    {
      department: "Engineering",
      score: 88,
      environmental: 85,
      social: 90,
      governance: 89,
    },
    {
      department: "Finance",
      score: 82,
      environmental: 78,
      social: 84,
      governance: 84,
    },
    {
      department: "Marketing",
      score: 79,
      environmental: 75,
      social: 85,
      governance: 77,
    },
    {
      department: "Operations",
      score: 86,
      environmental: 88,
      social: 84,
      governance: 86,
    },
    {
      department: "HR",
      score: 91,
      environmental: 82,
      social: 96,
      governance: 95,
    },
    {
      department: "Legal",
      score: 85,
      environmental: 80,
      social: 83,
      governance: 92,
    },
    {
      department: "Product",
      score: 83,
      environmental: 81,
      social: 87,
      governance: 81,
    },
    {
      department: "Design",
      score: 80,
      environmental: 78,
      social: 86,
      governance: 76,
    },
  ],
  participation: [
    { month: "Jan", value: 62 },
    { month: "Feb", value: 67 },
    { month: "Mar", value: 70 },
    { month: "Apr", value: 73 },
    { month: "May", value: 78 },
    { month: "Jun", value: 80 },
    { month: "Jul", value: 81 },
  ],
};

export const mockActivityFeed: ActivityItem[] = [
  {
    id: "act-1",
    type: "approval",
    title: "Engineering department carbon initiative approved",
    time: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    actor: "Priya Sharma",
  },
  {
    id: "act-2",
    type: "invitation",
    title: "5 new employees invited to the platform",
    time: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    actor: "Admin",
  },
  {
    id: "act-3",
    type: "challenge",
    title: "Zero Waste Week challenge completed by HR team",
    time: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    actor: "HR Department",
  },
  {
    id: "act-4",
    type: "report",
    title: "Q2 Environmental Report generated",
    time: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    actor: "System",
  },
  {
    id: "act-5",
    type: "department",
    title: "Sustainability department created",
    time: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    actor: "Owner",
  },
];

export const mockInsights: Insight[] = [
  {
    id: "ins-1",
    message:
      "Environmental score dropped 3% this week. Consider reviewing carbon activities.",
    severity: "warning",
    cta: "View Environmental",
    ctaHref: "/environment",
  },
  {
    id: "ins-2",
    message:
      "HR department participation rate reached 96% — highest across all departments.",
    severity: "success",
  },
  {
    id: "ins-3",
    message: "3 pending governance approvals require your attention.",
    severity: "critical",
    cta: "Review Approvals",
    ctaHref: "/governance",
  },
  {
    id: "ins-4",
    message: "Carbon reduction target exceeded by 20% for this quarter.",
    severity: "success",
    cta: "View Report",
    ctaHref: "/reports",
  },
];

export const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, name: "HR", score: 91, trend: "up" },
  { rank: 2, name: "Engineering", score: 88, trend: "stable" },
  { rank: 3, name: "Operations", score: 86, trend: "up" },
  { rank: 4, name: "Legal", score: 85, trend: "down" },
  { rank: 5, name: "Finance", score: 82, trend: "up" },
];
