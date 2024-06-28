import { IsString } from 'class-validator';

export class RoleDTO {
  @IsString()
  roleName: string;
  @IsString()
  color: string;
  @IsString()
  activateStatus: string;
}
