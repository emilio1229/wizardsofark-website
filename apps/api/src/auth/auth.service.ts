import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { PrismaService } from '../database/prisma.service';

const SESSION_COOKIE = 'woa_session';
const OAUTH_STATE_COOKIE = 'woa_oauth_state';
const SESSION_DAYS = 30;

type DiscordProfile = {
  id: string;
  username: string;
  global_name?: string | null;
  email?: string | null;
};

type AuthUser = {
  id: string;
  discordId: string | null;
  username: string | null;
  role: string | null;
  permissions: string[];
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  getDiscordAuthorizationUrl(invitationToken: string | undefined): {
    url: string;
    state: string;
  } {
    const state = randomBytes(32).toString('hex');
    const params = new URLSearchParams({
      client_id: this.config.getOrThrow<string>('discordClientId'),
      redirect_uri: this.config.getOrThrow<string>('discordRedirectUri'),
      response_type: 'code',
      scope: 'identify email',
      state,
    });

    return {
      url: `https://discord.com/oauth2/authorize?${params.toString()}`,
      state,
    };
  }

  async completeDiscordLogin(
    code: string,
    state: string,
    storedState: string | undefined,
  ): Promise<{ sessionToken: string; user: AuthUser }> {
    if (!storedState || !this.constantTimeEqual(state, storedState.split('.')[0])) {
      throw new UnauthorizedException('Invalid Discord OAuth state');
    }

    const profile = await this.exchangeDiscordCode(code);
    const adminIds = this.config.get<string[]>('authAdminDiscordIds', []);
    const isBootstrapAdmin = adminIds.includes(profile.id);

    const existing = await this.prisma.user.findUnique({
      where: { discordId: profile.id },
      include: { role: { include: { permissions: { include: { permission: true } } } } },
    });

    if (existing?.status === 'DISABLED') {
      throw new ForbiddenException('This account has been disabled');
    }

    const user = existing
      ? await this.prisma.user.update({
          where: { id: existing.id },
          data: {
            username: profile.global_name ?? profile.username,
            email: profile.email,
            ...(isBootstrapAdmin
              ? { status: 'ACTIVE', roleId: await this.ensureAdminRole() }
              : {}),
          },
          include: { role: { include: { permissions: { include: { permission: true } } } } },
        })
      : await this.prisma.user.create({
          data: {
            discordId: profile.id,
            username: profile.global_name ?? profile.username,
            email: profile.email,
            status: isBootstrapAdmin ? 'ACTIVE' : 'PENDING',
            roleId: isBootstrapAdmin ? await this.ensureAdminRole() : undefined,
          },
          include: { role: { include: { permissions: { include: { permission: true } } } } },
        });

    const sessionToken = randomBytes(32).toString('hex');
    await this.prisma.authSession.create({
      data: {
        tokenHash: this.hash(sessionToken),
        userId: user.id,
        expiresAt: this.daysFromNow(SESSION_DAYS),
      },
    });

    return { sessionToken, user: this.toUser(user) };
  }

  async getUserFromSession(sessionToken: string | undefined): Promise<AuthUser> {
    if (!sessionToken) {
      throw new UnauthorizedException('Authentication required');
    }
    const session = await this.prisma.authSession.findUnique({
      where: { tokenHash: this.hash(sessionToken) },
      include: {
        user: { include: { role: { include: { permissions: { include: { permission: true } } } } } },
      },
    });
    if (!session || session.expiresAt <= new Date() || session.user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Session expired');
    }
    return this.toUser(session.user);
  }

  async logout(sessionToken: string | undefined): Promise<void> {
    if (sessionToken) {
      await this.prisma.authSession.deleteMany({
        where: { tokenHash: this.hash(sessionToken) },
      });
    }
  }

  async hasPermission(sessionToken: string | undefined, permissionKey: string): Promise<boolean> {
    try {
      const user = await this.getUserFromSession(sessionToken);
      return user.role === 'admin' || user.permissions.includes(permissionKey);
    } catch {
      return false;
    }
  }

  async hasAnyPermission(sessionToken: string | undefined, permissionKeys: string[]): Promise<boolean> {
    try {
      const user = await this.getUserFromSession(sessionToken);
      return user.role === 'admin' || permissionKeys.some((key) => user.permissions.includes(key));
    } catch {
      return false;
    }
  }

  async createInvitation(
    sessionToken: string | undefined,
    roleId: string,
    expiresInDays: number,
  ): Promise<{ url: string; expiresAt: Date }> {
    const user = await this.getUserFromSession(sessionToken);
    if (user.role !== 'admin') {
      throw new ForbiddenException('Administrator access required');
    }
    const role = await this.prisma.role.findUnique({ where: { id: roleId } });
    if (!role) {
      throw new BadRequestException('Role not found');
    }

    const token = randomBytes(32).toString('hex');
    const expiresAt = this.daysFromNow(expiresInDays);
    await this.prisma.invitation.create({
      data: {
        tokenHash: this.hash(token),
        roleId,
        createdBy: user.id,
        expiresAt,
      },
    });
    const frontendUrl = this.config.getOrThrow<string>('frontendUrl');
    return { url: `${frontendUrl}/auth/discord?invite=${token}`, expiresAt };
  }

  async revokeInvitation(sessionToken: string | undefined, id: string): Promise<void> {
    const user = await this.getUserFromSession(sessionToken);
    if (user.role !== 'admin') {
      throw new ForbiddenException('Administrator access required');
    }
    await this.prisma.invitation.updateMany({
      where: { id, usedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  private async exchangeDiscordCode(code: string): Promise<DiscordProfile> {
    const body = new URLSearchParams({
      client_id: this.config.getOrThrow<string>('discordClientId'),
      client_secret: this.config.getOrThrow<string>('discordClientSecret'),
      grant_type: 'authorization_code',
      code,
      redirect_uri: this.config.getOrThrow<string>('discordRedirectUri'),
    });
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });
    if (!tokenResponse.ok) {
      throw new UnauthorizedException('Discord authorization failed');
    }
    const tokens = (await tokenResponse.json()) as { access_token?: string };
    if (!tokens.access_token) {
      throw new UnauthorizedException('Discord authorization failed');
    }
    const profileResponse = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    if (!profileResponse.ok) {
      throw new UnauthorizedException('Discord profile lookup failed');
    }
    return (await profileResponse.json()) as DiscordProfile;
  }

  private async findUsableInvitation(token: string) {
    return this.prisma.invitation.findFirst({
      where: {
        tokenHash: this.hash(token),
        usedAt: null,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
    });
  }

  private async ensureAdminRole(): Promise<string> {
    const role = await this.prisma.role.upsert({
      where: { name: 'admin' },
      create: { name: 'admin', description: 'Full site administration' },
      update: {},
    });
    return role.id;
  }

  private toUser(user: {
    id: string;
    discordId: string | null;
    username: string | null;
    role: { name: string; permissions: { permission: { key: string } }[] } | null;
  }): AuthUser {
    return {
      id: user.id,
      discordId: user.discordId,
      username: user.username,
      role: user.role?.name ?? null,
      permissions: user.role?.permissions.map(({ permission }) => permission.key) ?? [],
    };
  }

  private hash(value: string): string {
    return createHash('sha256').update(value).digest('hex');
  }

  private daysFromNow(days: number): Date {
    return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  }

  private constantTimeEqual(left: string, right: string): boolean {
    return left.length === right.length && this.hash(left) === this.hash(right);
  }
}

export { OAUTH_STATE_COOKIE, SESSION_COOKIE };
