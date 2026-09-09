import type { PermissionRole } from '../types';

const roleRank: Record<PermissionRole, number> = {
  guest: 0,
  member: 1,
  vip: 2,
  moderator: 3,
  council: 4,
  admin: 5,
  realm_master: 6,
};

export function hasMinimumRole(userRole: PermissionRole, required: PermissionRole): boolean {
  return roleRank[userRole] >= roleRank[required];
}

export function canManageServers(role: PermissionRole): boolean {
  return hasMinimumRole(role, 'admin');
}

export function canManageCouncil(role: PermissionRole): boolean {
  return hasMinimumRole(role, 'realm_master');
}

export function canManageShop(role: PermissionRole): boolean {
  return hasMinimumRole(role, 'admin');
}

export function canModerateCommunity(role: PermissionRole): boolean {
  return hasMinimumRole(role, 'moderator');
}
