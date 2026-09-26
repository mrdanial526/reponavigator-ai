export type Role = "ADMIN" | "EDITOR" | "CUSTOMER";

export const ROLE_PERMISSIONS: Record<Role, string[]> = {
  ADMIN: ["orders:read", "orders:write", "products:write", "users:manage"],
  EDITOR: ["products:write", "orders:read"],
  CUSTOMER: ["orders:read", "checkout:create"],
};

export function requirePermission(userRole: Role, permission: string): boolean {
  const allowed = ROLE_PERMISSIONS[userRole] || [];
  return allowed.includes(permission);
}
