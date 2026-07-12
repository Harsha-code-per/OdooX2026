/**
 * Authentication Types
 *
 * Mirror the auth payload shapes from 04-api-contract.md.
 */

/* ─── Request Payloads ─────────────────────────────────────────────────────── */
export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
}

export interface RefreshTokenPayload {
  refresh_token: string;
}

import type { UserRole } from "@/constants/roles";

/* ─── Response Shapes ──────────────────────────────────────────────────────── */
export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
}

export interface RegisterResponse {
  message: string;
  user_id: string;
}

export interface RefreshTokenResponse {
  access_token: string;
}

export interface MessageResponse {
  message: string;
}

/* ─── Auth State ───────────────────────────────────────────────────────────── */
export type AuthState =
  | "unauthenticated"
  | "authenticating"
  | "authenticated"
  | "session_expired"
  | "logging_out"
  | "password_reset";
