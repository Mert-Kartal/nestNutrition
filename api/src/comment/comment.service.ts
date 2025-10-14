import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CommentRepository } from './comment.repository';
import { UserService } from '../user/user.service';
import { ProductService } from '../product/product.service';
import { CreateCommentDto, UpdateCommentDto } from './comment.dto';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly userService: UserService,
    private readonly productService: ProductService,
  ) {}
  async create(userId: string, data: CreateCommentDto) {
    const user = await this.userService.findById(userId);
    const product = await this.productService.findById(data.productId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return this.commentRepository.create(userId, data);
  }
  async findAll() {
    return this.commentRepository.findAll();
  }
  async findById(id: string) {
    return this.commentRepository.findById(id);
  }
  async update(userId: string, id: string, data: UpdateCommentDto) {
    const comment = await this.commentRepository.findById(id);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    if (comment.userId !== userId) {
      throw new ForbiddenException(
        'You are not allowed to update this comment',
      );
    }
    const effectiveTitle = data.title
      ? data.title
      : (comment.title ?? undefined);
    const effectiveContent = data.content
      ? data.content
      : (comment.content ?? undefined);

    if (!effectiveTitle && effectiveContent) {
      throw new BadRequestException('Content cannot exist without title.');
    }
    return this.commentRepository.update(id, {
      rating: data.rating ?? comment.rating,
      title: effectiveTitle,
      content: effectiveContent,
    });
  }
  async delete(userId: string, id: string) {
    const comment = await this.commentRepository.findById(id);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    if (comment.userId !== userId) {
      throw new ForbiddenException(
        'You are not allowed to delete this comment',
      );
    }
    return this.commentRepository.delete(id);
  }
}
