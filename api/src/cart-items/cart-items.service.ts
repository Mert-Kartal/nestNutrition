import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCartDto, UpdateCartDto } from './cart-items.dto';
import { CartItemsRepository } from './cart-items.repository';
import { ProductService } from '../product/product.service';
import { UserService } from '../user/user.service';
import { Product } from '@prisma/client';

@Injectable()
export class CartItemsService {
  constructor(
    private readonly cartItemsRepository: CartItemsRepository,
    private readonly productService: ProductService,
    private readonly userService: UserService,
  ) {}
  private async findOne(userId: string, productId: string) {
    const cartItem = await this.cartItemsRepository.findOne(userId, productId);
    return cartItem ? cartItem : undefined;
  }
  async create(userId: string, data: CreateCartDto) {
    await this.userService.findById(userId);
    const product = await this.productService.findById(data.productId);
    if (
      product[0].stock_quantity < data.quantity ||
      product[0].stock_quantity === 0
    ) {
      throw new BadRequestException('Product stock is not enough');
    }
    const existCartItem = await this.findOne(userId, data.productId);
    if (existCartItem) {
      if (existCartItem.quantity + data.quantity > product[0].stock_quantity) {
        throw new BadRequestException('Product stock is not enough');
      }
      await this.cartItemsRepository.update(userId, data.productId, {
        quantity: existCartItem.quantity + data.quantity,
      });
    } else {
      await this.cartItemsRepository.create(userId, data);
    }
    return 'Product added to cart';
  }
  async findAll(userId: string) {
    const cartItems = await this.cartItemsRepository.findAll(userId);
    if (!cartItems) {
      throw new NotFoundException('Cart is empty');
    }
    return cartItems;
  }
  async update(userId: string, productId: string, data: UpdateCartDto) {
    await this.userService.findById(userId);
    const cartItem = await this.findOne(userId, productId);
    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }
    if (data.quantity === 0) {
      await this.remove(userId, productId);
      return 'Cart item removed';
    }
    if (data.quantity > (cartItem.Product as Product).stock_quantity) {
      throw new BadRequestException('Product stock is not enough');
    }
    await this.cartItemsRepository.update(userId, productId, data);
    return 'Cart item updated';
  }
  async remove(userId: string, productId: string) {
    const cartItem = await this.findOne(userId, productId);
    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }
    await this.cartItemsRepository.remove(userId, productId);
    return 'Cart item removed';
  }
}

/**
 * ürünün stok adeti 0 ise sepetten sil
 * ürün stok adeti sepetteki miktardan az ise sepetten sil
 */
