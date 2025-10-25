import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtGuard } from '../shared/guard/jwt.guard';
import type { Request } from 'express';

@UseGuards(JwtGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Req() req: Request) {
    return this.orderService.create(req.user.userId);
  }

  @Get()
  findAll(@Req() req: Request) {
    return this.orderService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    return this.orderService.findOne(id, req.user.userId);
  }
}
