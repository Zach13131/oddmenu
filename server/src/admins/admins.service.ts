import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Roles } from '@prisma/client';

const { SALT_LENGTH } = process.env;

const saltLength = parseInt(SALT_LENGTH);

@Injectable()
export class AdminsService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createAdminDto: CreateAdminDto) {
    const hashed_password: string = await bcrypt.hash(
      createAdminDto.password,
      saltLength,
    );

    const dataToSave = {
      login: createAdminDto.login,
      password: hashed_password,
      role: Roles.ADMIN,
      hashedRefreshToken: 'none',
    };

    const newAdmin = this.prisma.admins.create({ data: dataToSave });
    return newAdmin;
  }

  findAll() {
    const admins = this.prisma.admins.findMany();
    return admins;
  }

  async update(id: string, updateAdminDto: UpdateAdminDto) {
    let hashed_password: string;
    if (updateAdminDto.password) {
      hashed_password = await bcrypt.hash(updateAdminDto.password, saltLength);
    }

    const dataToSave = {
      login: updateAdminDto.login,
      password: hashed_password,
    };

    const updatedAdmin = this.prisma.admins.update({
      where: { id },
      data: dataToSave,
    });
    return updatedAdmin;
  }

  async remove(id: string) {
    const existingAdmin = await this.prisma.admins.findFirst({ where: { id } });

    if (!existingAdmin) {
      throw new NotFoundException('Admin not found');
    }

    if (existingAdmin.role === Roles.SUPER_ADMIN) {
      throw new BadRequestException('Super Admin could not be deleted');
    }

    const removedAdmin = await this.prisma.admins.delete({ where: { id } });
    return removedAdmin;
  }
}
