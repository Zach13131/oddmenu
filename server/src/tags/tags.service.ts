import { Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TagsService {
  constructor(private readonly prisma: PrismaService) {} // Inject PrismaService

  async create(createTagDto: CreateTagDto) {
    const tag = await this.prisma.tag.create({
      data: createTagDto,
    });
    return tag;
  }

  async findAll() {
    const tags = await this.prisma.tag.findMany();
    return tags;
  }

  async update(id: string, updateTagDto: UpdateTagDto) {
    const updatedTag = await this.prisma.tag.update({
      where: { id },
      data: updateTagDto,
    });
    return updatedTag;
  }

  async remove(id: string) {
    const deletedTag = await this.prisma.tag.delete({
      where: { id },
    });
    return deletedTag;
  }
}
