import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly jwtService: JwtService) {
    super();
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    if (err) {
      throw new UnauthorizedException('Authentication error');
    }

    if (info) {
      // 判断不同的错误类型并提供详细的错误信息
      if (info.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token has expired');
      } else if (info.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid token');
      } else {
        throw new UnauthorizedException('Authentication error');
      }
    }

    if (!user) {
      throw new UnauthorizedException('No user found');
    }

    const request = context.switchToHttp().getRequest();
    request.user = user;
    return user;
  }
}
