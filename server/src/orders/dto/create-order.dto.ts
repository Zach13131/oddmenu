import { IsArray, IsInt, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @IsString()
  mealId: string;
  @IsInt()
  mealQuantity: number;
}

export class CreateOrderDto {
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  @IsArray()
  orderItems: OrderItemDto[];

  @IsString()
  userPhoneNumber: string;
}
