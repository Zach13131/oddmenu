import { IsInt, IsString } from 'class-validator';

export class CreateMealDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsInt()
  price: number;

  @IsString()
  imageUrl: string;

  @IsString()
  categoryId: string;
}
