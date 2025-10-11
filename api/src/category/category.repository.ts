import { Injectable } from '@nestjs/common';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}
  create(data: CreateCategoryDto) {
    return this.prisma.category.create({
      data,
    });
  }
  findAll() {
    return this.prisma.category.findMany({
      orderBy: {
        order: 'asc',
      },
      select: {
        id: true,
        name: true,
        slug: true,
        order: true,
      },
    });
  }
  findById(id: string) {
    return this.prisma.category.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        slug: true,
        order: true,
      },
    });
  }
  findBySlug(slug: string) {
    return this.prisma.category.findUnique({
      where: { slug },
    });
  }
  findMaxOrder() {
    return this.prisma.category.findFirst({
      orderBy: {
        order: 'desc',
      },
    });
  }
  findByOrder(order: number) {
    return this.prisma.category.findFirst({
      where: { order },
    });
  }
  update(id: string, data: UpdateCategoryDto) {
    return this.prisma.category.update({
      where: { id },
      data,
    });
  }
  switchOrder(oldOrder: number, newOrder: number) {
    return this.prisma.$executeRaw`
  UPDATE categories
  SET "order" = CASE
    WHEN "order" = ${oldOrder} THEN ${newOrder}
    WHEN "order" = ${newOrder} THEN ${oldOrder}
  END
  WHERE "order" IN (${oldOrder}, ${newOrder});
`;
  }
  delete(id: string, order: number) {
    return this.prisma.$transaction([
      this.prisma.category.updateMany({
        where: { order: { gt: order } },
        data: {
          order: {
            decrement: 1,
          },
        },
      }),
      this.prisma.category.delete({
        where: { id },
      }),
    ]);
  }
}
