import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMealDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetMealDto } from './dto/get-meals.dto';
import { Meal } from '@prisma/client';

@Injectable()
export class MealsService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createMealDto: CreateMealDto) {
    const existingCollection = await this.prisma.category.findFirst({
      where: {
        id: createMealDto.categoryId,
      },
    });
    if (!existingCollection) {
      throw new NotFoundException('collection not found');
    }

    const createdMeal = await this.prisma.meal.create({ data: createMealDto });

    return createdMeal;
  }

  async findOne(id: string) {
    const existingMeal = await this.prisma.meal.findUnique({
      where: { id },
    });

    if (!existingMeal) {
      throw new NotFoundException('Meal not found');
    }
    return existingMeal;
  }

  async update(id: string, updateMealDto: UpdateMealDto) {
    const existingMeal = await this.prisma.meal.findUnique({
      where: { id },
    });

    if (!existingMeal) {
      throw new NotFoundException('Meal not found');
    }

    const updatedMeal = await this.prisma.meal.update({
      where: { id },
      data: updateMealDto,
    });

    return updatedMeal;
  }

  async remove(id: string) {
    const existingMeal = await this.prisma.meal.findUnique({
      where: { id },
    });

    if (!existingMeal) {
      throw new NotFoundException('Meal not found');
    }

    const updatedMeal = await this.prisma.meal.delete({
      where: {
        id,
      },
    });

    return updatedMeal;
  }

  async findAll(body: GetMealDto): Promise<Meal[]> {
    const { title, searchInDescription, orderByPrice } = body;

    const findMealsQuery: any = {};

    if (title) {
      findMealsQuery.where = {};
      findMealsQuery.where.OR = [];
      findMealsQuery.where.OR.push({
        title: {
          contains: title,
          mode: 'insensitive',
        },
      });
    }

    if (searchInDescription && title) {
      findMealsQuery.where.OR.push({
        description: {
          contains: title,
          mode: 'insensitive',
        },
      });
    }

    if (orderByPrice) {
      findMealsQuery.orderBy = {
        price: orderByPrice,
      };
    }

    const meals = await this.prisma.meal.findMany(findMealsQuery);

    return meals;
  }
}
