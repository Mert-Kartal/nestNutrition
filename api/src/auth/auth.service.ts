import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginDto, RegisterDto, VerifyCodeDto } from './auth.dto';
import argon2 from 'argon2';
import { JwtService } from '../jwt/jwt.service';
import { Redis } from 'ioredis';
import { EmailProducerService } from '../email/email-producer.service';
import { VERIFICATION_CODE_HTML_TEMPLATE } from '../email/verify-code';
import { REDIS_CLIENT } from '../redis/redis.module';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @Inject(REDIS_CLIENT) private readonly redisClient: Redis,
    private readonly emailProducerService: EmailProducerService,
  ) {}
  async register(data: RegisterDto) {
    const existingEmail = await this.userService.findByEmail(data.email);
    const existingUsername = await this.userService.findByUsername(
      data.username,
    );
    if (existingEmail || existingUsername) {
      throw new BadRequestException('Email or username is taken');
    }
    try {
      const hashedPassword = await argon2.hash(data.password);
      const code = Math.floor(100000 + Math.random() * 900000);
      const expires_in_minutes = 15;
      const current_year = new Date().getFullYear();
      const htmlContent = VERIFICATION_CODE_HTML_TEMPLATE.replace(
        '{{VERIFICATION_CODE}}',
        code.toString(),
      )
        .replace('{{EXPIRES_IN_MINUTES}}', expires_in_minutes.toString())
        .replace('{{CURRENT_YEAR}}', current_year.toString());
      await this.redisClient.hset('user:' + data.email, {
        ...data,
        password: hashedPassword,
        code,
      });
      await this.redisClient.expire('user:' + data.email, 60 * 15);
      await this.emailProducerService.addEmailJob({
        to: data.email,
        subject: 'Verification Code',
        html: htmlContent,
      });
      return {
        message: 'Registration successful, check your email for the code',
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Registration failed');
    }
  }
  async login(loginDto: LoginDto) {
    const user = await this.userService.findByEmail(loginDto.email);
    if (!user || !user.password) {
      throw new BadRequestException('Invalid credentials');
    }
    const isPasswordValid = await argon2.verify(
      user.password,
      loginDto.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }
    try {
      const { accessToken, refreshToken } = await this.jwtService.generateToken(
        {
          userId: user.id,
          role: user.role,
        },
      );
      return { accessToken, refreshToken };
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Login failed');
    }
  }
  async verifyCode(data: VerifyCodeDto) {
    const tempUser = await this.redisClient.hgetall('user:' + data.email);
    if (!tempUser || +tempUser.code !== data.code) {
      throw new BadRequestException('Invalid code');
    }
    const existingUser = await this.userService.findByEmail(tempUser.email);
    let user: Omit<User, 'password' | 'createdAt' | 'updatedAt' | 'deletedAt'>;
    if (existingUser) {
      throw new BadRequestException('User already exists');
    } else {
      user = await this.userService.create({
        email: tempUser.email,
        name: tempUser.name,
        lastName: tempUser.lastName,
        fullName: `${tempUser.name} ${tempUser.lastName}`,
        username: tempUser.username,
        password: tempUser.password,
      });
    }
    await this.redisClient.del('user:' + data.email);
    const { accessToken, refreshToken } = await this.jwtService.generateToken({
      userId: user.id,
      role: user.role,
    });
    return { accessToken, refreshToken };
  }
  async logout(header: string) {
    return this.jwtService.logout(header);
  }
  async logoutAll(header: string) {
    return this.jwtService.logoutAll(header);
  }
  async refresh(header: string) {
    return this.jwtService.refresh(header);
  }
}
