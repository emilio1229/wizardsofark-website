import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { CreateInvitationDto } from './auth.dto';
import { AuthService, OAUTH_STATE_COOKIE, SESSION_COOKIE } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('discord')
  startDiscord(@Query('invite') invite: string | undefined, @Res() response: Response): void {
    const { url, state } = this.authService.getDiscordAuthorizationUrl(invite);
    response.setHeader(
      'Set-Cookie',
      `${OAUTH_STATE_COOKIE}=${encodeURIComponent(state)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=600`,
    );
    response.redirect(url);
  }

  @Get('discord/callback')
  async discordCallback(
    @Query('code') code: string | undefined,
    @Query('state') state: string | undefined,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    const storedState = this.readCookie(request, OAUTH_STATE_COOKIE);
    const result = await this.authService.completeDiscordLogin(code ?? '', state ?? '', storedState);
    const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:5173';
    response.setHeader('Set-Cookie', [
      `${SESSION_COOKIE}=${result.sessionToken}; HttpOnly; SameSite=Lax; Path=/; Max-Age=2592000`,
      `${OAUTH_STATE_COOKIE}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`,
    ]);
    response.redirect(`${frontendUrl}/`);
  }

  @Get('me')
  getCurrentUser(@Req() request: Request) {
    return this.authService.getUserFromSession(this.readCookie(request, SESSION_COOKIE));
  }

  @Post('logout')
  async logout(@Req() request: Request, @Res() response: Response): Promise<void> {
    await this.authService.logout(this.readCookie(request, SESSION_COOKIE));
    response.setHeader(
      'Set-Cookie',
      `${SESSION_COOKIE}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`,
    );
    response.status(204).send();
  }

  @Post('invitations')
  createInvitation(@Req() request: Request, @Body() body: CreateInvitationDto) {
    return this.authService.createInvitation(
      this.readCookie(request, SESSION_COOKIE),
      body.roleId,
      body.expiresInDays,
    );
  }

  @Post('invitations/:id/revoke')
  async revokeInvitation(@Req() request: Request, @Param('id') id: string): Promise<void> {
    await this.authService.revokeInvitation(
      this.readCookie(request, SESSION_COOKIE),
      id,
    );
  }

  private readCookie(request: Request, name: string): string | undefined {
    const header = request.headers.cookie ?? '';
    const value = header
      .split(';')
      .map((part) => part.trim())
      .find((part) => part.startsWith(`${name}=`))
      ?.slice(name.length + 1);
    return value ? decodeURIComponent(value) : undefined;
  }
}
