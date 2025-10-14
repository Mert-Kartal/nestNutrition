import {
  Min,
  Max,
  IsOptional,
  IsString,
  IsNotEmpty,
  IsNumber,
  IsUUID,
} from 'class-validator';
import { OmitType, PartialType } from '@nestjs/mapped-types';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  productId: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  content?: string;
}

export class UpdateCommentDto extends OmitType(PartialType(CreateCommentDto), [
  'productId',
]) {}
