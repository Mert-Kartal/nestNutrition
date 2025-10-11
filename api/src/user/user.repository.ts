import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './user.dto';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(user: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        ...user,
        fullName: `${user.name} ${user.lastName}`,
      },
    });
  }
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
  async findByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }
  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        lastName: true,
        fullName: true,
        phone: true,
        photo: true,
      },
    });
  }
  async update(id: string, user: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: user,
    });
  }
}
