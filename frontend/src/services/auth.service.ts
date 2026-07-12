import { API_ENDPOINTS } from "@/constants/api";
import type { UserRole } from "@/constants/roles";
import { apiClient } from "@/lib/api-client";
import { getCookie, removeCookie, setCookie } from "@/lib/cookies";
import type {
  ForgotPasswordPayload,
  LoginPayload,
  LoginResponse,
  MessageResponse,
  RegisterPayload,
  RegisterResponse,
  ResetPasswordPayload,
} from "@/types/auth";

interface BackendUser {
  id: string;
  full_name: string;
  role_id: number;
  must_change_password: boolean;
  provider: string;
  profile_picture: string | null;
}

interface BackendLoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: BackendUser;
}

interface BackendRegisterResponse {
  message: string;
  user_id: string;
  email_verification_required?: boolean;
}

function mapRoleIdToUserRole(roleId: number): UserRole {
  if (roleId === 1) return "ADMIN";
  if (roleId === 2 || roleId === 3) return "MANAGER";
  return "EMPLOYEE";
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const data = await apiClient.post<BackendLoginResponse>(
    API_ENDPOINTS.AUTH.LOGIN,
    {
      email: payload.email,
      password: payload.password,
    },
  );

  // Store tokens in cookies
  setCookie("ecosphere_access_token", data.access_token, 1); // 1 day
  setCookie("ecosphere_refresh_token", data.refresh_token, 30); // 30 days

  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_in: data.expires_in,
    user: {
      id: data.user.id,
      name: data.user.full_name,
      email: payload.email, // Fallback since email is not returned from login body
      role: mapRoleIdToUserRole(data.user.role_id),
    },
  };
}

export async function register(
  payload: RegisterPayload,
): Promise<RegisterResponse> {
  const data = await apiClient.post<BackendRegisterResponse>(
    API_ENDPOINTS.AUTH.REGISTER,
    {
      email: payload.email,
      password: payload.password,
      full_name: payload.name,
      department_id: null,
    },
  );

  return {
    message:
      data.message ||
      "Registration successful. Please check your email to verify.",
    user_id: data.user_id,
  };
}

export async function forgotPassword(
  payload: ForgotPasswordPayload,
): Promise<MessageResponse> {
  // Backend password reset request route is POST /auth/reset-password
  return apiClient.post<MessageResponse>(
    API_ENDPOINTS.AUTH.FORGOT_PASSWORD, // maps to /auth/forgot-password, let's verify if matches config
    {
      email: payload.email,
    },
  );
}

export async function resetPassword(
  payload: ResetPasswordPayload,
): Promise<MessageResponse> {
  // Backend password reset confirm route is POST /auth/reset-password/confirm
  return apiClient.post<MessageResponse>(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
    token: payload.token,
    new_password: payload.password,
  });
}

export async function logout(): Promise<void> {
  const refreshToken = getCookie("ecosphere_refresh_token");
  if (refreshToken) {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, {
        refresh_token: refreshToken,
      });
    } catch {
      // Ignore network errors during logout
    }
  }

  // Clear client-side tokens
  removeCookie("ecosphere_access_token");
  removeCookie("ecosphere_refresh_token");
}

export async function getGoogleAuthUrl(): Promise<{
  authorization_url: string;
  state?: string;
}> {
  return apiClient.get<{ authorization_url: string; state?: string }>(
    "/auth/google/login",
  );
}

export async function loginWithGoogle(
  code: string,
  state?: string,
): Promise<LoginResponse> {
  const data = await apiClient.post<BackendLoginResponse>(
    "/auth/google/callback",
    {
      code,
      state,
    },
  );

  // Store tokens in cookies
  setCookie("ecosphere_access_token", data.access_token, 1);
  setCookie("ecosphere_refresh_token", data.refresh_token, 30);

  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_in: data.expires_in,
    user: {
      id: data.user.id,
      name: data.user.full_name,
      email: "", // Fallback, will be filled via restoreSession
      role: mapRoleIdToUserRole(data.user.role_id),
    },
  };
}
