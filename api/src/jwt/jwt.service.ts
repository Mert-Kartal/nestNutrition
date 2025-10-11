import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../shared/types/express';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}
  private splitToken(header: string) {
    if (header.startsWith('Bearer ')) {
      return header.split(' ')[1];
    }
    throw new UnauthorizedException('Invalid token');
  }
  private async revokeToken(header: string) {
    const token = this.splitToken(header);
    try {
      const decoded = jwt.verify(
        token,
        this.configService.get('JWT_REFRESH_SECRET') as string,
      ) as JwtPayload;
      const tokenRecord = await this.prisma.token.findUnique({
        where: { id: decoded.jti },
      });
      if (!tokenRecord || tokenRecord.revokedAt) {
        throw new UnauthorizedException('Invalid token');
      }
      await this.prisma.token.update({
        where: { id: decoded.jti },
        data: { revokedAt: new Date() },
      });
      return decoded;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Invalid token');
    }
  }
  async generateToken(payload: JwtPayload) {
    const accessToken = jwt.sign(
      payload,
      this.configService.get('JWT_ACCESS_SECRET') as string,
      { expiresIn: '1h' },
    );
    const refreshTokenRecord = await this.prisma.token.create({
      data: {
        userId: payload.userId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
    const refreshToken = jwt.sign(
      { ...payload, jti: refreshTokenRecord.id },
      this.configService.get('JWT_REFRESH_SECRET') as string,
      { expiresIn: '7d' },
    );
    return { accessToken, refreshToken };
  }
  async refresh(header: string) {
    const decoded = await this.revokeToken(header);
    const { accessToken, refreshToken } = await this.generateToken({
      userId: decoded.userId,
      role: decoded.role,
    });
    return { accessToken, refreshToken };
  }
  async logout(header: string) {
    await this.revokeToken(header);
    return { message: 'Logout successfully' };
  }
  verifyToken(header: string, secret: string) {
    const token = this.splitToken(header);
    try {
      return jwt.verify(token, secret) as JwtPayload;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Invalid token');
    }
  }
  async logoutAll(header: string) {
    const decoded = this.verifyToken(
      header,
      this.configService.get('JWT_REFRESH_SECRET') as string,
    );
    await this.prisma.token.updateMany({
      where: { userId: decoded.userId },
      data: { revokedAt: new Date() },
    });
    return { message: 'Logout all successfully' };
  }
}
