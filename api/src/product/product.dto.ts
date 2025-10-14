import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  Min,
  IsArray,
  ArrayMaxSize,
  ArrayMinSize,
  ValidateNested,
} from 'class-validator';
import { PartialType, OmitType } from '@nestjs/mapped-types';
import { Transform, Type } from 'class-transformer';
import { Product } from '@prisma/client';

export class ProductPhotoType {
  @IsNotEmpty()
  @IsString()
  photoUrl: string;

  @IsNotEmpty()
  @IsNumber()
  photoSize: number;

  @IsOptional()
  @IsNumber()
  order?: number;
}

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  categoryId: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  slug: string;

  @IsNotEmpty()
  @IsString()
  shortDescription: string;

  @IsNotEmpty()
  @IsString()
  longDescription: string;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  @Min(0)
  price: number;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  @Min(0)
  stock_quantity: number;

  @IsNotEmpty()
  @IsString()
  primaryPhoto: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  @ValidateNested({ each: true })
  @Type(() => ProductPhotoType)
  productPhotos: ProductPhotoType[];
}

export class UpdateProductDto extends OmitType(PartialType(CreateProductDto), [
  'productPhotos',
]) {}

export class CreateProductServiceDto extends OmitType(CreateProductDto, [
  'slug',
  'primaryPhoto',
  'productPhotos',
  'shortDescription',
  'longDescription',
]) {
  @IsNotEmpty()
  @IsString()
  description: string;
}

export class UpdateProductServiceDto extends OmitType(UpdateProductDto, [
  'slug',
  'shortDescription',
  'longDescription',
  'primaryPhoto',
]) {
  @IsOptional()
  @IsString()
  description?: string;
}

export interface FoundProduct extends Product {
  average_rating: number;
  comment_count: number;
  photo_urls: string[];
}
