import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';

enum SortOrder {
  asc = 'asc',
  desc = 'desc',
}

export class GetMealDto {
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description:
      'Boolean indicating whether to include matches from the description field.',
    type: Boolean,
    required: false,
    default: true,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  searchInDescription?: boolean = true;

  @IsOptional()
  @IsEnum(SortOrder)
  orderByPrice?: SortOrder;
}
