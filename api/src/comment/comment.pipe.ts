import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { CreateCommentDto } from './comment.dto';

@Injectable()
export class CommentConsistencyPipe implements PipeTransform {
  transform(value: CreateCommentDto) {
    const { title, content } = value;
    if (!title && content) {
      throw new BadRequestException('Content cannot exist without title.');
    }
    return value;
  }
}
