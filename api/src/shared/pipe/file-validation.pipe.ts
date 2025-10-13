import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  transform(value: Express.Multer.File[]) {
    if (!value || (Array.isArray(value) && value.length === 0)) {
      throw new BadRequestException('Photos are required');
    }
    if (value.length > 10) {
      throw new BadRequestException('Maximum 10 photos are allowed');
    }
    return value;
  }
}
