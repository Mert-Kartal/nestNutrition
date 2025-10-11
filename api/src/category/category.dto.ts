import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { OmitType } from '@nestjs/mapped-types';

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

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  order?: number;

  @IsOptional()
  @IsString()
  slug?: string;
}

export class CreateCategoryServiceDto extends OmitType(CreateCategoryDto, [
  'slug',
  'order',
]) {}

export class UpdateCategoryServiceDto extends OmitType(UpdateCategoryDto, [
  'slug',
]) {}
