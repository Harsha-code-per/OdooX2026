/**
 * Permissions — RBAC permission matrix
 *
 * Maps each permission to the minimum role required.
 * Feature-level guards use this to show/hide UI elements.
 */
import { hasMinimumRole, USER_ROLES, type UserRole } from "@/constants/roles";

export const PERMISSIONS = {
  /* Organization */
  MANAGE_ORGANIZATION: USER_ROLES.OWNER,
  VIEW_REPORTS: USER_ROLES.MANAGER,
  GENERATE_REPORTS: USER_ROLES.ADMIN,

  /* Departments */
  CREATE_DEPARTMENT: USER_ROLES.ADMIN,
  EDIT_DEPARTMENT: USER_ROLES.ADMIN,
  ARCHIVE_DEPARTMENT: USER_ROLES.OWNER,

  /* Members */
  INVITE_MEMBER: USER_ROLES.ADMIN,
  EDIT_MEMBER: USER_ROLES.ADMIN,
  DEACTIVATE_MEMBER: USER_ROLES.ADMIN,
  ASSIGN_ROLE: USER_ROLES.OWNER,

  /* Activities */
  CREATE_ACTIVITY: USER_ROLES.EMPLOYEE,
  APPROVE_ACTIVITY: USER_ROLES.MANAGER,

  /* Policies */
  CREATE_POLICY: USER_ROLES.ADMIN,
  EDIT_POLICY: USER_ROLES.ADMIN,

  /* Settings */
  MANAGE_SETTINGS: USER_ROLES.OWNER,
  VIEW_SETTINGS: USER_ROLES.EMPLOYEE,

  /* Challenges */
  CREATE_CHALLENGE: USER_ROLES.ADMIN,
  PARTICIPATE_CHALLENGE: USER_ROLES.EMPLOYEE,
} as const;

export type Permission = keyof typeof PERMISSIONS;

/**
 * Check if a user role has a specific permission.
 */
export function can(userRole: UserRole, permission: Permission): boolean {
  return hasMinimumRole(userRole, PERMISSIONS[permission]);
}
