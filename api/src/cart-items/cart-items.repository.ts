import { Injectable } from '@nestjs/common';
import { CartItemDto, CreateCartDto, UpdateCartDto } from './cart-items.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CartItemsRepository {
  constructor(private readonly prisma: PrismaService) {}
  create(userId: string, data: CreateCartDto) {
    return this.prisma.cartItem.create({
      data: {
        ...data,
        userId,
      },
    });
  }
  findAll(userId: string): Promise<CartItemDto[]> {
    return this.prisma.$queryRaw`
  WITH cart_data AS (
    SELECT
      p.id AS product_id,
      p.name,
      p.price,
      ci.quantity,
      (p.price * ci.quantity) AS total_price
    FROM cart_items AS ci
    JOIN products AS p ON ci.product_id = p.id
    WHERE ci.user_id = ${userId}
  )
  SELECT *, (SELECT SUM(total_price)::int FROM cart_data) AS grand_total
  FROM cart_data;
`;
  }
  findOne(userId: string, productId: string) {
    return this.prisma.cartItem.findUnique({
      where: { userId_productId: { userId, productId } },
      include: {
        Product: true,
      },
    });
  }
  update(userId: string, productId: string, data: UpdateCartDto) {
    return this.prisma.cartItem.update({
      where: { userId_productId: { userId, productId } },
      data,
    });
  }
  remove(userId: string, productId: string) {
    return this.prisma.cartItem.delete({
      where: { userId_productId: { userId, productId } },
    });
  }
  removeAll(userId: string, tx?: Prisma.TransactionClient) {
    const client = tx || this.prisma;
    return client.cartItem.deleteMany({
      where: { userId },
    });
  }
  removeAllByProductIdAndQuantity(productId: string, quantity: number) {
    return this.prisma.cartItem.deleteMany({
      where: { productId, quantity: { gt: quantity } },
    });
  }
}
