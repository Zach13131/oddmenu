import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

const { ACCESS_TOKEN_KEY } = process.env;

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();

    const authHeader = req.headers.authorization;

    if (!authHeader) throw new UnauthorizedException('Not authorized');

    const bearer = authHeader.split(' ')[0];
    const token = authHeader.split(' ')[1];
    if (bearer != 'Bearer' || !token)
      throw new UnauthorizedException('Not authorized');

    try {
      const user = await this.jwtService.verify(token, {
        secret: ACCESS_TOKEN_KEY,
      });

      const findUser = await this.prisma.admins.findFirst({
        where: { id: user.id },
      });

      if (!findUser) throw new UnauthorizedException('Not authorized');

      req.user = {
        id: findUser.id,
      };

      return true;
    } catch (error) {
      if (error instanceof TokenExpiredError)
        throw new UnauthorizedException('Token expired');
    }
  }
}
