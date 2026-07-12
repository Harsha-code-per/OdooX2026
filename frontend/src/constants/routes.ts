/**
 * Route Constants
 *
 * Never hardcode routes in components.
 * Always import from this file.
 *
 * Defined per 01-frontend-architecture.md and 03-product-ui-specification.md.
 */

export const ROUTES = {
  /* ─── Public (marketing) ─────────────────────────────────────────────────── */
  HOME: "/",
  FEATURES: "/features",
  ABOUT: "/about",
  CONTACT: "/contact",

  /* ─── Authentication ─────────────────────────────────────────────────────── */
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",

  /* ─── Dashboard ──────────────────────────────────────────────────────────── */
  DASHBOARD: "/dashboard",

  /* ─── Environmental ──────────────────────────────────────────────────────── */
  ENVIRONMENT: "/environment",
  ENVIRONMENT_CARBON: "/environment/carbon",
  ENVIRONMENT_GOALS: "/environment/goals",

  /* ─── Social ─────────────────────────────────────────────────────────────── */
  SOCIAL: "/social",
  SOCIAL_ACTIVITIES: "/social/activities",
  SOCIAL_PARTICIPATION: "/social/participation",

  /* ─── Governance ─────────────────────────────────────────────────────────── */
  GOVERNANCE: "/governance",
  GOVERNANCE_POLICIES: "/governance/policies",
  GOVERNANCE_COMPLIANCE: "/governance/compliance",

  /* ─── Workspace / Team ───────────────────────────────────────────────────── */
  TEAM: "/team",
  TEAM_DEPARTMENTS: "/team/departments",
  TEAM_DEPARTMENT_DETAIL: (id: string) => `/team/departments/${id}`,
  TEAM_MEMBERS: "/team/members",
  TEAM_ROLES: "/team/roles",

  /* ─── Reports ────────────────────────────────────────────────────────────── */
  REPORTS: "/reports",
  REPORTS_ANALYTICS: "/reports/analytics",
  REPORTS_EXPORTS: "/reports/exports",
  REPORTS_HISTORY: "/reports/history",

  /* ─── Settings & Profile ─────────────────────────────────────────────────── */
  SETTINGS: "/settings",
  PROFILE: "/profile",
  NOTIFICATIONS: "/notifications",
} as const;

/** Routes that require authentication */
export const PROTECTED_ROUTES = [
  ROUTES.DASHBOARD,
  ROUTES.ENVIRONMENT,
  ROUTES.SOCIAL,
  ROUTES.GOVERNANCE,
  ROUTES.TEAM,
  ROUTES.REPORTS,
  ROUTES.SETTINGS,
  ROUTES.PROFILE,
  ROUTES.NOTIFICATIONS,
] as const;

/** Routes that redirect to dashboard if already authenticated */
export const AUTH_ROUTES = [
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  ROUTES.FORGOT_PASSWORD,
  ROUTES.RESET_PASSWORD,
] as const;
