import { IsInt, IsString, Max, Min } from 'class-validator';

export class CreateInvitationDto {
  @IsString()
  roleId!: string;

  @IsInt()
  @Min(1)
  @Max(30)
  expiresInDays = 7;
}
