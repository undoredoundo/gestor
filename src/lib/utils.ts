import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Permission } from "./types";
import { ROLES } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function stringToSlug(str: string) {
  return str
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export function hasPermission(
  userRole: string,
  requiredPermission: Permission,
): boolean {
  const role = ROLES[userRole as keyof typeof ROLES];

  if (!role) {
    throw new Error(`Invalid user role: ${userRole}`);
  }

  if (role.includes("*")) {
    return true;
  }

  return role.includes(requiredPermission);
}
