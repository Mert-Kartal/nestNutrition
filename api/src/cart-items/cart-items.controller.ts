import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CartItemsService } from './cart-items.service';
import { CreateCartDto, UpdateCartDto } from './cart-items.dto';
import { JwtGuard } from '../shared/guard/jwt.guard';
import type { Request } from 'express';

@UseGuards(JwtGuard)
@Controller('cart-items')
export class CartItemsController {
  constructor(private readonly cartItemsService: CartItemsService) {}
  @Post()
  create(@Body() data: CreateCartDto, @Req() req: Request) {
    return this.cartItemsService.create(req.user.userId, data);
  }
  @Get()
  findAll(@Req() req: Request) {
    return this.cartItemsService.findAll(req.user.userId);
  }
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateCartDto,
    @Req() req: Request,
  ) {
    return this.cartItemsService.update(req.user.userId, id, data);
  }
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    return this.cartItemsService.remove(req.user.userId, id);
  }
  @Delete()
  removeAll(@Req() req: Request) {
    return this.cartItemsService.removeAll(req.user.userId);
  }
}
