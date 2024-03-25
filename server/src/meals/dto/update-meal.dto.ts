import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateMealDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsInt()
  price: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
