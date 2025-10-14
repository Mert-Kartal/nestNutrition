import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto, UpdateCommentDto } from './comment.dto';

@Injectable()
export class CommentRepository {
  constructor(private readonly prisma: PrismaService) {}
  create(userId: string, data: CreateCommentDto) {
    return this.prisma.comment.create({
      data: {
        ...data,
        userId,
      },
    });
  }
  findAll() {
    return this.prisma.comment.findMany();
  }
  findById(id: string) {
    return this.prisma.comment.findUnique({
      where: { id },
    });
  }
  update(id: string, data: UpdateCommentDto) {
    return this.prisma.comment.update({
      where: { id },
      data,
    });
  }
  delete(id: string) {
    return this.prisma.comment.delete({
      where: { id },
    });
  }
}
