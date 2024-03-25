import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { Response } from 'express';

const {
  ACCESS_TOKEN_TIME,
  ACCESS_TOKEN_KEY,
  SALT_LENGTH,
  MAX_REFRESH_TOKEN_AGE,
  COOKIE_SECURE,
  REFRESH_TOKEN_KEY,
  REFRESH_TOKEN_TIME,
} = process.env;

const saltLength = parseInt(SALT_LENGTH);
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async login({ login, password }: CreateAuthDto, res: Response) {
    const findUser = await this.prisma.admins.findFirst({ where: { login } });
    if (!findUser) {
      throw new NotFoundException('User not found');
    }
    const hashed_password: string = await bcrypt.hash(password, saltLength);

    console.log(
      'file: auth.service.ts:28 ~ AuthService ~ login ~ hashed_password:',
      hashed_password,
    );

    const isMatchPass = await bcrypt.compare(password, findUser.password);

    if (!isMatchPass) {
      throw new BadRequestException('User not found');
    }
    const { accessToken, refreshToken } = await this.getTokens(
      findUser.role,
      findUser.id,
    );

    const hashedRefreshToken = await bcrypt.hash(refreshToken, saltLength);

    await this.prisma.admins.update({
      where: {
        id: findUser.id,
      },
      data: {
        hashedRefreshToken,
      },
    });

    this.setRefreshTokenCookie(refreshToken, res);

    return { accessToken, id: findUser.id };
  }

  async refreshToken(userId: string, refreshToken: string, res: Response) {
    const decodedToken = await this.jwtService.verify(refreshToken, {
      secret: REFRESH_TOKEN_KEY,
    });

    if (!decodedToken) throw new BadRequestException('Token not valid');

    if (userId != decodedToken.id)
      throw new BadRequestException('User not found');

    const user = await this.prisma.admins.findFirst({
      where: { id: userId },
    });
    if (!user || !user.hashedRefreshToken)
      throw new BadRequestException('Token not valid');

    const tokenMatch = await bcrypt.compare(
      refreshToken,
      user.hashedRefreshToken,
    );

    if (!tokenMatch) throw new ForbiddenException('Forbidden token');

    const { accessToken, refreshToken: newRefreshToken } = await this.getTokens(
      user.role,
      user.id,
    );
    const hashedRefreshToken = await bcrypt.hash(newRefreshToken, saltLength);

    await this.prisma.admins.update({
      data: { hashedRefreshToken },
      where: { id: userId },
    });

    this.setRefreshTokenCookie(newRefreshToken, res);
    return {
      accessToken,
      newRefreshToken,
      id: user.id,
    };
  }

  async getTokens(role: string, id: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { role, id },
        {
          secret: ACCESS_TOKEN_KEY,
          expiresIn: ACCESS_TOKEN_TIME,
        },
      ),
      this.jwtService.signAsync(
        { role, id },
        {
          secret: REFRESH_TOKEN_KEY,
          expiresIn: REFRESH_TOKEN_TIME,
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  setRefreshTokenCookie(refresh_token: string, res: Response) {
    const maxAge = parseInt(MAX_REFRESH_TOKEN_AGE || '0', 10);
    res.cookie('refreshToken', refresh_token, {
      maxAge,
      httpOnly: true,
      sameSite: 'strict',
      secure: !!COOKIE_SECURE,
    });
  }
}
