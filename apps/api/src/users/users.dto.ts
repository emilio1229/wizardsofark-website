import { IsArray, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  permissionKeys: string[] = [];
}

export class UpdateRolePermissionsDto {
  @IsArray()
  @IsString({ each: true })
  permissionKeys: string[] = [];
}

export class AssignUserRoleDto {
  @IsOptional()
  @IsString()
  roleId?: string | null;
}
