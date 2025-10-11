import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '../../jwt/jwt.service';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const header = request.headers.authorization;
    if (!header) {
      throw new UnauthorizedException('No token provided');
    }
    try {
      const token = this.jwtService.verifyToken(
        header,
        this.configService.get('JWT_ACCESS_SECRET') as string,
      );
      request.user = token;
      return true;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
