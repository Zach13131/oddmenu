import { IsString } from 'class-validator';

export class CreateAdminDto {
  @IsString()
  login: string;

  @IsString()
  password: string;
}
