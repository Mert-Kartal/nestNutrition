import { Injectable } from '@nestjs/common';
import { CartItemDto, CreateCartDto, UpdateCartDto } from './cart.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CartRepository {
  constructor(private readonly prisma: PrismaService) { }
  create(cartId: string, data: CreateCartDto) {
    return this.prisma.cartItem.create({
      data: {
        ...data,
        cartId,
      },
    });
  }
  findAll(cartId: string): Promise<CartItemDto[]> {
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
    WHERE ci.cart_id = ${cartId}
  )
  SELECT *, (SELECT SUM(total_price)::int FROM cart_data) AS grand_total
  FROM cart_data;
`;
  }
  findOne(cartId: string, productId: string) {
    return this.prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId, productId } },
      include: {
        Product: true,
      },
    });
  }
  update(cartId: string, productId: string, data: UpdateCartDto) {
    return this.prisma.cartItem.update({
      where: { cartId_productId: { cartId, productId } },
      data,
    });
  }
  remove(cartId: string, productId: string) {
    return this.prisma.cartItem.delete({
      where: { cartId_productId: { cartId, productId } },
    });
  }
  removeAll(cartId: string, tx?: Prisma.TransactionClient) {
    const client = tx || this.prisma;
    return client.cartItem.deleteMany({
      where: { cartId },
    });
  }
  removeAllByProductIdAndQuantity(productId: string, quantity: number) {
    return this.prisma.cartItem.deleteMany({
      where: { productId, quantity: { gt: quantity } },
    });
  }
}
