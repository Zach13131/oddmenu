import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetCategoryDto } from './dto/get-category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const category = await this.prisma.category.create({
      data: createCategoryDto,
    });
    return category;
  }

  async findAll(body: GetCategoryDto) {
    const getCategoryQuery: any = {};

    if (body.tagId) {
      getCategoryQuery.where = {
        tagId: body.tagId,
      };
    }

    const categories = await this.prisma.category.findMany(getCategoryQuery);
    return categories;
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        meals: true,
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    const updatedCategory = await this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });
    return updatedCategory;
  }

  async remove(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }

    const deletedCategory = await this.prisma.category.delete({
      where: { id },
    });
    return deletedCategory;
  }
}
