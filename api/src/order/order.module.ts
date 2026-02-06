import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderRepository } from './order.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { CartModule } from '../cart/cart.module';
import { ProductModule } from '../product/product.module';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [PrismaModule, CartModule, SharedModule, ProductModule],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository],
})
export class OrderModule { }
