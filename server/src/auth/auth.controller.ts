import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  Param,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Request } from 'express';
@ApiTags('auth')
@Controller('login')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  create(
    @Body() createAuthDto: CreateAuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(createAuthDto, res);
  }

  @Get(':id/refresh')
  refreshToken(
    @Param('id') id: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    console.log(
      'file: auth.controller.ts:27 ~ AuthController ~ req:',
      req.cookies,
    );
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken)
      throw new UnauthorizedException('Refresh token not found');
    return this.authService.refreshToken(id, refreshToken, res);
  }
}
