import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import { SESSION_COOKIE } from '../auth/auth.service';
import {
  AssignUserRoleDto,
  CreateRoleDto,
  UpdateRolePermissionsDto,
} from './users.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('roles')
  listRoles(@Req() request: Request) {
    return this.usersService.listRoles(this.readSession(request));
  }

  @Get()
  listUsers(@Req() request: Request) {
    return this.usersService.listUsers(this.readSession(request));
  }

  @Patch(':id/role')
  assignUserRole(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() body: AssignUserRoleDto,
  ) {
    return this.usersService.assignUserRole(
      this.readSession(request),
      id,
      body.roleId ?? null,
    );
  }

  @Post('roles')
  createRole(@Req() request: Request, @Body() body: CreateRoleDto) {
    return this.usersService.createRole(
      this.readSession(request),
      body.name,
      body.description,
      body.permissionKeys,
    );
  }

  @Delete('roles/:id')
  deleteRole(@Req() request: Request, @Param('id') id: string): Promise<void> {
    return this.usersService.deleteRole(this.readSession(request), id);
  }

  @Patch('roles/:id/permissions')
  updateRolePermissions(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() body: UpdateRolePermissionsDto,
  ) {
    return this.usersService.updateRolePermissions(
      this.readSession(request),
      id,
      body.permissionKeys,
    );
  }

  @Get('permissions')
  listPermissions(@Req() request: Request) {
    return this.usersService.listPermissions(this.readSession(request));
  }

  private readSession(request: Request): string | undefined {
    const cookie = request.headers.cookie ?? '';
    const value = cookie
      .split(';')
      .map((part) => part.trim())
      .find((part) => part.startsWith(`${SESSION_COOKIE}=`))
      ?.slice(SESSION_COOKIE.length + 1);
    return value ? decodeURIComponent(value) : undefined;
  }
}
