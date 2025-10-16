import { Module } from '@nestjs/common';
import { CartItemsService } from './cart-items.service';
import { CartItemsController } from './cart-items.controller';
import { CartItemsRepository } from './cart-items.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { SharedModule } from '../shared/shared.module';
import { UserModule } from '../user/user.module';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [PrismaModule, SharedModule, UserModule, ProductModule],
  controllers: [CartItemsController],
  providers: [CartItemsService, CartItemsRepository],
})
export class CartItemsModule {}
