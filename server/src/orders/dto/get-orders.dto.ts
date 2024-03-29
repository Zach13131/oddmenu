import { IsDate, IsEnum, IsOptional } from 'class-validator';
import { OrderStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class GetOrderDto {
  @ApiProperty({ enum: OrderStatus })
  @IsOptional()
  @IsEnum(OrderStatus)
  orderByOrderStatus?: OrderStatus;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  @ApiProperty({
    example: '2024-03-29T00:00:00',
    description: 'YYYY-MM-DDTHH:mm:ss',
  })
  startDate?: Date;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  @ApiProperty({
    example: '2024-03-29T23:59:59',
    description: 'YYYY-MM-DDTHH:mm:ss',
  })
  endDate?: Date;
}
