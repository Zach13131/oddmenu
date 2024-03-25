import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderStatus } from '@prisma/client';
import { GetOrderDto } from './dto/get-orders.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createOrderDto: CreateOrderDto) {
    const meals = await this.prisma.meal.findMany({
      where: {
        id: {
          in: createOrderDto.orderItems.map((item) => item.mealId),
        },
      },
    });

    const totalCost = createOrderDto.orderItems.reduce((acc, item) => {
      const meal = meals.find((m) => m.id === item.mealId);
      if (!meal) {
        throw new NotFoundException(`Meal with ID ${item.mealId} not found`);
      }
      return acc + meal.price * item.mealQuantity;
    }, 0);

    const order = await this.prisma.order.create({
      data: {
        totalCost,
        userPhoneNumber: createOrderDto.userPhoneNumber,
        status: OrderStatus.PENDING,
        orderItems: {
          createMany: {
            data: createOrderDto.orderItems.map((item) => ({
              mealId: item.mealId,
              mealQuantity: item.mealQuantity,
            })),
          },
        },
      },
      include: {
        orderItems: {
          include: {
            meal: true,
          },
        },
      },
    });

    return order;
  }

  async findAll(query: GetOrderDto) {
    const { orderByOrderStatus } = query;
    const findOrderQuery: {
      include: {
        orderItems: true;
      };
      orderBy: {
        createdAt: 'desc';
      };
      where?: {
        status: any;
      };
    } = {
      include: {
        orderItems: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    };
    if (orderByOrderStatus) {
      findOrderQuery.where = {
        status: {
          equals: orderByOrderStatus,
        },
      };
    }

    const orders = await this.prisma.order.findMany(findOrderQuery);

    const ordersWithItemCount = orders.map((order) => {
      const orderItemCount = order.orderItems.reduce(
        (acc, item) => acc + item.mealQuantity,
        0,
      );

      delete order.orderItems;

      return {
        ...order,
        orderItemCount,
      };
    });

    return ordersWithItemCount;
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: {
            meal: true,
          },
        },
      },
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const existingOrder = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id },
      data: updateOrderDto,
    });

    return updatedOrder;
  }
}
