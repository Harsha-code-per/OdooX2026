import { delay } from "@/lib/helpers";
import { mockCurrentUser } from "@/mocks/users";
import type {
  ForgotPasswordPayload,
  LoginPayload,
  LoginResponse,
  MessageResponse,
  RegisterPayload,
  RegisterResponse,
  ResetPasswordPayload,
} from "@/types/auth";

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  await delay(1000); // Realistic network delay

  // Simple mock check
  if (payload.email === "error@ecosphere.io") {
    throw new Error("Invalid email or password. Please try again.");
  }

  return {
    access_token: "mock-access-token-jwt-12345",
    refresh_token: "mock-refresh-token-jwt-67890",
    expires_in: 3600,
    user: {
      id: mockCurrentUser.id,
      name:
        payload.email.split("@")[0].charAt(0).toUpperCase() +
        payload.email.split("@")[0].slice(1),
      email: payload.email,
      role: mockCurrentUser.role,
    },
  };
}

export async function register(
  payload: RegisterPayload,
): Promise<RegisterResponse> {
  await delay(1200);

  if (payload.email === "exists@ecosphere.io") {
    throw new Error("An account with this email address already exists.");
  }

  return {
    message: "Registration successful. Please log in.",
    user_id: "user-new-9999",
  };
}

export async function forgotPassword(
  payload: ForgotPasswordPayload,
): Promise<MessageResponse> {
  await delay(800);

  if (payload.email === "error@ecosphere.io") {
    throw new Error("No account found with this email address.");
  }

  return {
    message: "A password reset link has been sent to your email address.",
  };
}

export async function resetPassword(
  _payload: ResetPasswordPayload,
): Promise<MessageResponse> {
  await delay(1000);

  return {
    message: "Your password has been reset successfully.",
  };
}

export async function logout(): Promise<void> {
  await delay(300);
}
