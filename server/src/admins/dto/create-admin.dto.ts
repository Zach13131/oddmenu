import { IsString } from 'class-validator';

export class CreateAdminDto {
  @IsString()
  name: string;

  @IsString()
  login: string;

  @IsString()
  password: string;
}
