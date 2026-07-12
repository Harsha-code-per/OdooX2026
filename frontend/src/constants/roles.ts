/**
 * User Roles and Permissions
 *
 * Defined per 00-project-decisions.md — Role-Based Access Control (RBAC).
 * Never hardcode role strings in components. Always import from here.
 */

export const USER_ROLES = {
  OWNER: "OWNER",
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  EMPLOYEE: "EMPLOYEE",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const ROLE_LABELS: Record<UserRole, string> = {
  OWNER: "Organization Owner",
  ADMIN: "Administrator",
  MANAGER: "Department Manager",
  EMPLOYEE: "Employee",
};

/**
 * Role hierarchy — higher index = lower authority.
 * Used to compare role access levels.
 */
export const ROLE_HIERARCHY: UserRole[] = [
  USER_ROLES.OWNER,
  USER_ROLES.ADMIN,
  USER_ROLES.MANAGER,
  USER_ROLES.EMPLOYEE,
];

/**
 * Returns true if the user's role has at least the required role's authority.
 */
export function hasMinimumRole(
  userRole: UserRole,
  requiredRole: UserRole,
): boolean {
  return (
    ROLE_HIERARCHY.indexOf(userRole) <= ROLE_HIERARCHY.indexOf(requiredRole)
  );
}
