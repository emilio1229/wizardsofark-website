import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { AuthService } from '../auth/auth.service';

export const PERMISSION_OPTIONS = [
  { key: 'site.admin.access', label: 'Site administration', description: 'Open the Site Admin area.' },
  { key: 'users.manage', label: 'Manage users', description: 'View users and assign roles.' },
  { key: 'roles.manage', label: 'Manage roles', description: 'Create, edit, and delete roles.' },
  { key: 'servers.manage', label: 'Manage servers', description: 'Manage server content and settings.' },
  { key: 'council.manage', label: 'Manage council', description: 'Manage council content.' },
  { key: 'shop.manage', label: 'Manage shop', description: 'Manage shop content.' },
  { key: 'community.moderate', label: 'Moderate community', description: 'Moderate community activity.' },
  { key: 'community.media.manage', label: 'Manage community media', description: 'Upload, edit, and remove media.' },
] as const;

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {}

  async listRoles(sessionToken: string | undefined) {
    await this.requireAnyPermission(sessionToken, ['roles.manage', 'users.manage']);
    return this.prisma.role.findMany({
      orderBy: { name: 'asc' },
      include: {
        permissions: { include: { permission: true } },
        _count: { select: { users: true } },
      },
    });
  }

  async listUsers(sessionToken: string | undefined) {
    await this.requirePermission(sessionToken, 'users.manage');
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        discordId: true,
        username: true,
        email: true,
        status: true,
        createdAt: true,
        role: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async assignUserRole(
    sessionToken: string | undefined,
    userId: string,
    roleId: string | null,
  ) {
    await this.requirePermission(sessionToken, 'users.manage');
    if (roleId) {
      const role = await this.prisma.role.findUnique({ where: { id: roleId } });
      if (!role) {
        throw new ForbiddenException('Role not found');
      }
    }
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        roleId,
        status: roleId ? 'ACTIVE' : 'PENDING',
      },
      select: {
        id: true,
        discordId: true,
        username: true,
        status: true,
        role: { select: { id: true, name: true } },
      },
    });
  }

  async createRole(
    sessionToken: string | undefined,
    name: string,
    description: string | undefined,
    permissionKeys: string[],
  ) {
    await this.requirePermission(sessionToken, 'roles.manage');
    const permissions = await this.resolvePermissions(permissionKeys);
    return this.prisma.role.create({
      data: {
        name,
        description,
        permissions: {
          create: permissions.map((permission) => ({ permissionId: permission.id })),
        },
      },
      include: { permissions: { include: { permission: true } } },
    });
  }

  async updateRolePermissions(
    sessionToken: string | undefined,
    roleId: string,
    permissionKeys: string[],
  ) {
    await this.requirePermission(sessionToken, 'roles.manage');
    const permissions = await this.resolvePermissions(permissionKeys);
    return this.prisma.$transaction(async (transaction) => {
      await transaction.rolePermission.deleteMany({ where: { roleId } });
      return transaction.role.update({
        where: { id: roleId },
        data: {
          permissions: {
            create: permissions.map((permission) => ({ permissionId: permission.id })),
          },
        },
        include: { permissions: { include: { permission: true } } },
      });
    });
  }

  async listPermissions(sessionToken: string | undefined) {
    await this.requirePermission(sessionToken, 'roles.manage');
    return PERMISSION_OPTIONS;
  }

  async deleteRole(sessionToken: string | undefined, roleId: string): Promise<void> {
    await this.requirePermission(sessionToken, 'roles.manage');
    const role = await this.prisma.role.findUnique({
      where: { id: roleId },
      include: { _count: { select: { users: true } } },
    });
    if (!role) {
      throw new ForbiddenException('Role not found');
    }
    if (role.name === 'admin') {
      throw new ForbiddenException('The admin role cannot be deleted');
    }
    if (role._count.users > 0) {
      throw new ForbiddenException('Remove assigned users before deleting this role');
    }
    await this.prisma.$transaction(async (transaction) => {
      await transaction.invitation.deleteMany({ where: { roleId } });
      await transaction.role.delete({ where: { id: roleId } });
    });
  }

  private async requirePermission(sessionToken: string | undefined, permissionKey: string): Promise<void> {
    if (!(await this.authService.hasPermission(sessionToken, permissionKey))) {
      throw new ForbiddenException('Required permission is missing');
    }
  }

  private async requireAnyPermission(sessionToken: string | undefined, permissionKeys: string[]): Promise<void> {
    if (!(await this.authService.hasAnyPermission(sessionToken, permissionKeys))) {
      throw new ForbiddenException('Required permission is missing');
    }
  }

  private async resolvePermissions(permissionKeys: string[]) {
    const allowed = new Set<string>(PERMISSION_OPTIONS.map((option) => option.key));
    const invalid = permissionKeys.filter((key) => !allowed.has(key));
    if (invalid.length > 0) {
      throw new ForbiddenException(`Unknown permission: ${invalid[0]}`);
    }
    return Promise.all(
      permissionKeys.map((key) =>
        this.prisma.permission.upsert({ where: { key }, create: { key }, update: {} }),
      ),
    );
  }
}
