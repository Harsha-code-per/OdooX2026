/**
 * API Constants
 *
 * Never hardcode API URLs in components or services.
 * Always import from this file.
 *
 * Base URL configured per environment:
 * - Development: /api/v1 (proxied by Next.js)
 * - Production: set via NEXT_PUBLIC_API_URL environment variable
 */

import { env } from "@/config/env";

export const API_BASE_URL = env.NEXT_PUBLIC_API_URL;

export const API_ENDPOINTS = {
  /* ─── Auth ───────────────────────────────────────────────────────────────── */
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
  },

  /* ─── Users ──────────────────────────────────────────────────────────────── */
  USERS: {
    ME: "/auth/me",
    LIST: "/users",
    INVITE: "/users/invite",
    BY_ID: (id: string) => `/users/${id}`,
  },

  /* ─── Dashboard ──────────────────────────────────────────────────────────── */
  DASHBOARD: {
    SUMMARY: "/dashboard/summary",
    CHARTS: "/dashboard/charts",
    ACTIVITY: "/dashboard/activity",
  },

  /* ─── Departments ────────────────────────────────────────────────────────── */
  DEPARTMENTS: {
    LIST: "/departments",
    CREATE: "/departments",
    BY_ID: (id: string) => `/departments/${id}`,
  },

  /* ─── Roles ──────────────────────────────────────────────────────────────── */
  ROLES: {
    LIST: "/roles",
  },

  /* ─── Environmental ──────────────────────────────────────────────────────── */
  ENVIRONMENT: {
    OVERVIEW: "/environment/overview",
    ACTIVITIES: "/environment/activities",
    CREATE_ACTIVITY: "/environment/activity",
  },

  /* ─── Social ─────────────────────────────────────────────────────────────── */
  SOCIAL: {
    OVERVIEW: "/social/overview",
    EVENTS: "/social/events",
    CREATE_EVENT: "/social/event",
  },

  /* ─── Governance ─────────────────────────────────────────────────────────── */
  GOVERNANCE: {
    OVERVIEW: "/governance/overview",
    POLICIES: "/governance/policies",
    CREATE_POLICY: "/governance/policy",
  },

  /* ─── Reports ────────────────────────────────────────────────────────────── */
  REPORTS: {
    LIST: "/reports",
    GENERATE: "/reports/generate",
  },

  /* ─── Notifications ──────────────────────────────────────────────────────── */
  NOTIFICATIONS: {
    LIST: "/notifications",
    MARK_READ: "/notifications/read",
  },

  /* ─── Profile ────────────────────────────────────────────────────────────── */
  PROFILE: {
    GET: "/profile",
    UPDATE: "/profile",
    UPDATE_PASSWORD: "/profile/password",
  },

  /* ─── Settings ───────────────────────────────────────────────────────────── */
  SETTINGS: {
    GET: "/settings",
    UPDATE: "/settings",
  },
} as const;

/** Default request timeout in milliseconds */
export const API_TIMEOUT_MS = 30_000;
