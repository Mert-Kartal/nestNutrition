import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './user.dto';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateUserDto) {
    return this.prisma.user.create({
      data,
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        lastName: true,
        fullName: true,
        phone: true,
        photo: true,
        role: true,
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
  async findAll() {
    return this.prisma.user.findMany({
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
  async update(id: string, data: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        lastName: true,
        fullName: true,
        phone: true,
        photo: true,
        role: true,
      },
    });
  }
}
