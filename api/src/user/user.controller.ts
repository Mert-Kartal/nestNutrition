import {
  Controller,
  UseGuards,
  Req,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Body,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserServiceDto } from './user.dto';
import { JwtGuard } from '../shared/guard/jwt.guard';
import type { Request } from 'express';
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @UseGuards(JwtGuard)
  @Get('me')
  async me(@Req() req: Request) {
    return this.userService.findById(req.user.userId);
  }
  @Get()
  async findAll() {
    return this.userService.findAll();
  }
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.findById(id);
  }
  @UseGuards(JwtGuard)
  @Patch('me')
  async updateMe(@Req() req: Request, @Body() data: UpdateUserServiceDto) {
    return this.userService.update(req.user.userId, data);
  }
}
