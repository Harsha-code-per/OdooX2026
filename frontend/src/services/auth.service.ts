/**
 * Auth Service
 *
 * Phase 1: Shell stubs (no mock needed for auth — forms drive these)
 * Phase 12: Replace with real apiClient calls
 */

import { delay } from "@/lib/helpers";
import type {
  ForgotPasswordPayload,
  LoginPayload,
  LoginResponse,
  MessageResponse,
  RegisterPayload,
  RegisterResponse,
  ResetPasswordPayload,
} from "@/types/auth";

export async function login(_payload: LoginPayload): Promise<LoginResponse> {
  await delay(800);
  /* Phase 12: return apiClient.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, payload) */
  throw new Error(
    "Auth service not yet connected to backend. Implement in Phase 12.",
  );
}

export async function register(
  _payload: RegisterPayload,
): Promise<RegisterResponse> {
  await delay(800);
  /* Phase 12: return apiClient.post<RegisterResponse>(API_ENDPOINTS.AUTH.REGISTER, payload) */
  throw new Error(
    "Auth service not yet connected to backend. Implement in Phase 12.",
  );
}

export async function forgotPassword(
  _payload: ForgotPasswordPayload,
): Promise<MessageResponse> {
  await delay(600);
  /* Phase 12: return apiClient.post<MessageResponse>(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, payload) */
  throw new Error(
    "Auth service not yet connected to backend. Implement in Phase 12.",
  );
}

export async function resetPassword(
  _payload: ResetPasswordPayload,
): Promise<MessageResponse> {
  await delay(600);
  /* Phase 12: return apiClient.post<MessageResponse>(API_ENDPOINTS.AUTH.RESET_PASSWORD, payload) */
  throw new Error(
    "Auth service not yet connected to backend. Implement in Phase 12.",
  );
}

export async function logout(): Promise<void> {
  await delay(300);
  /* Phase 12: return apiClient.post(API_ENDPOINTS.AUTH.LOGOUT) */
}
