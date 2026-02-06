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
import { CartService } from './cart.service';
import { CreateCartDto, UpdateCartDto } from './cart.dto';
import { JwtGuard } from '../shared/guard/jwt.guard';
import type { Request } from 'express';

@UseGuards(JwtGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) { }
  @Post()
  create(@Body() data: CreateCartDto, @Req() req: Request) {
    return this.cartService.create(req.user.userId, data);
  }
  @Get()
  findAll(@Req() req: Request) {
    return this.cartService.findAll(req.user.userId);
  }
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateCartDto,
    @Req() req: Request,
  ) {
    return this.cartService.update(req.user.userId, id, data);
  }
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    return this.cartService.remove(req.user.userId, id);
  }
  @Delete()
  removeAll(@Req() req: Request) {
    return this.cartService.removeAll(req.user.userId);
  }
}
