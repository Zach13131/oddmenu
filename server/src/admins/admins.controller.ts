import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SuperAdminGuard } from 'src/guard/super-admin.guard';
import { AdminGuard } from 'src/guard/admin.guard';

@ApiTags('admins')
@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @ApiBearerAuth()
  @UseGuards(SuperAdminGuard)
  @Post()
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminsService.create(createAdminDto);
  }

  @ApiBearerAuth()
  @UseGuards(SuperAdminGuard)
  @Get()
  findAll() {
    return this.adminsService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Get('me')
  findOne(@Req() req: any) {
    return req.user;
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
    @Req() req: any,
  ) {
    return this.adminsService.update(id, updateAdminDto, req.user);
  }

  @ApiBearerAuth()
  @UseGuards(SuperAdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminsService.remove(id);
  }
}
