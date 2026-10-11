import type { UserRole } from '@/types/database';

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  user: 0,
  admin: 10,
  owner: 20,
};

export function hasRole(userRole: UserRole | null | undefined, required: UserRole): boolean {
  if (!userRole) return false;
  return (ROLE_HIERARCHY[userRole] ?? -1) >= ROLE_HIERARCHY[required];
}

export function isAdmin(userRole: UserRole | null | undefined): boolean {
  return hasRole(userRole, 'admin');
}

export function isOwner(userRole: UserRole | null | undefined): boolean {
  return userRole === 'owner';
}
