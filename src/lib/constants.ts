import type { Permission, Role } from "./types";

export const ROLES: Record<Role, Permission[]> = {
  admin: ["*"],
  employee: ["stock.read", "stock.write"],
  user: [],
} as const;
