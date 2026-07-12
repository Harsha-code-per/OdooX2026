/**
 * Mock User Data
 *
 * Mirrors GET /users/me and GET /users responses.
 */

import { USER_ROLES } from "@/constants/roles";
import type { User } from "@/types/user";

export const mockCurrentUser: User = {
  id: "user-001",
  name: "Harshavardhan Reddy",
  email: "harsha@ecosphere.io",
  role: USER_ROLES.OWNER,
  department: "Leadership",
  avatar: undefined,
};

export const mockUsers: User[] = [
  mockCurrentUser,
  {
    id: "user-002",
    name: "Priya Sharma",
    email: "priya@ecosphere.io",
    role: USER_ROLES.ADMIN,
    department: "HR",
    status: "active",
  },
  {
    id: "user-003",
    name: "Arjun Mehta",
    email: "arjun@ecosphere.io",
    role: USER_ROLES.MANAGER,
    department: "Engineering",
    status: "active",
  },
  {
    id: "user-004",
    name: "Sneha Patel",
    email: "sneha@ecosphere.io",
    role: USER_ROLES.EMPLOYEE,
    department: "Engineering",
    status: "active",
  },
  {
    id: "user-005",
    name: "Rahul Nair",
    email: "rahul@ecosphere.io",
    role: USER_ROLES.EMPLOYEE,
    department: "Marketing",
    status: "active",
  },
  {
    id: "user-006",
    name: "Ananya Kumar",
    email: "ananya@ecosphere.io",
    role: USER_ROLES.MANAGER,
    department: "Finance",
    status: "active",
  },
];
