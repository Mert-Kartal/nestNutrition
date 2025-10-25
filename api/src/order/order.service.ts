import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderRepository } from './order.repository';
import { CartItemsService } from '../cart-items/cart-items.service';
import { ProductService } from '../product/product.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly cartItemsService: CartItemsService,
    private readonly productService: ProductService,
    private readonly prisma: PrismaService,
  ) {}
  async create(userId: string) {
    const cartItems = await this.cartItemsService.findAll(userId);
    const orderItems = cartItems.map((item) => ({
      productId: item.product_id,
      quantity: item.quantity,
      total_price: item.total_price,
    }));
    return this.prisma.$transaction(async (tx) => {
      await this.orderRepository.create(
        userId,
        cartItems[0].grand_total,
        orderItems,
        tx,
      );
      for (const item of orderItems) {
        const product = await this.productService.findById(item.productId);
        await this.productService.update(
          item.productId,
          {
            stock_quantity: product[0].stock_quantity - item.quantity,
          },
          tx,
        );
      }
      await this.cartItemsService.removeAll(userId, tx);
      return 'Order created successfully';
    });
  }

  async findAll(userId: string) {
    const orders = await this.orderRepository.findAll(userId);
    if (orders.length === 0) {
      throw new NotFoundException('Order not found');
    }
    return orders;
  }

  async findOne(id: string, userId?: string) {
    const order = await this.orderRepository.findOne(id);
    if (!order || (userId && order.userId !== userId)) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }
}
