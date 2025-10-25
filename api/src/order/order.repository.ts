import { Injectable } from '@nestjs/common';
import { CreateOrderItemDto } from './order.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrderRepository {
  constructor(private readonly prisma: PrismaService) {}
  create(
    userId: string,
    grand_total: number,
    data: CreateOrderItemDto[],
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx || this.prisma;
    return client.order.create({
      data: {
        totalPrice: grand_total,
        userId,
        orderItems: {
          createMany: {
            data: data.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.total_price,
            })),
          },
        },
      },
    });
  }

  findAll(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
    });
  }

  findOne(id: string) {
    return this.prisma.order.findUnique({
      where: { id },
    });
  }
}
