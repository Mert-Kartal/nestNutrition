import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { OmitType, PartialType } from '@nestjs/mapped-types';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  order: number;

  @IsNotEmpty()
  @IsString()
  slug: string;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}

export class CreateCategoryServiceDto extends OmitType(CreateCategoryDto, [
  'slug',
  'order',
]) {}

export class UpdateCategoryServiceDto extends OmitType(UpdateCategoryDto, [
  'slug',
]) {}
