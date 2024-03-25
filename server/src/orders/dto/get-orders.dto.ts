import { IsEnum, IsOptional } from 'class-validator';
import { OrderStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class GetOrderDto {
  @ApiProperty({ enum: OrderStatus })
  @IsOptional()
  @IsEnum(OrderStatus)
  orderByOrderStatus?: OrderStatus;
}
