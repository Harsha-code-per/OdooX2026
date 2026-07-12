import type { UserRole } from "@/constants/roles";

/**
 * User Types
 *
 * Mirror the user response shape from 04-api-contract.md:
 * GET /users/me and GET /users responses.
 */

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  avatar?: string;
  status?: UserStatus;
  createdAt?: string;
  updatedAt?: string;
}

export type UserStatus = "active" | "inactive" | "pending";

export interface InviteUserPayload {
  email: string;
  role: UserRole;
  department: string;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  department?: string;
  role?: UserRole;
}
