import {
  Controller,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  ParseUUIDPipe,
  Req,
  Get,
} from '@nestjs/common';
import type { Request } from 'express';
import { CommentService } from './comment.service';
import { JwtGuard } from '../shared/guard/jwt.guard';
import { CreateCommentDto, UpdateCommentDto } from './comment.dto';
import { CommentConsistencyPipe } from './comment.pipe';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}
  @UseGuards(JwtGuard)
  @Post()
  create(
    @Body(CommentConsistencyPipe) data: CreateCommentDto,
    @Req() req: Request,
  ) {
    return this.commentService.create(req.user.userId, data);
  }
  @Get()
  findAll() {
    return this.commentService.findAll();
  }
  @Get(':id')
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.commentService.findById(id);
  }
  @UseGuards(JwtGuard)
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateCommentDto,
    @Req() req: Request,
  ) {
    return this.commentService.update(req.user.userId, id, data);
  }
  @UseGuards(JwtGuard)
  @Delete(':id')
  delete(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    return this.commentService.delete(req.user.userId, id);
  }
}
