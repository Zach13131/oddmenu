import { IsString, IsOptional } from 'class-validator';

export class GetCategoryDto {
  @IsOptional()
  @IsString()
  tagId?: string;
}
