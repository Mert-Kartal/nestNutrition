import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateProductDto,
  FoundProduct,
  ProductPhotoType,
  UpdateProductDto,
} from './product.dto';

@Injectable()
export class ProductRepository {
  constructor(private readonly prisma: PrismaService) {}
  create(data: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        ...data,
        productPhotos: {
          createMany: {
            data: data.productPhotos.map((photo, index) => ({
              photoUrl: photo.photoUrl,
              photoSize: photo.photoSize,
              isPrimary: index === 0,
              order: index,
            })),
          },
        },
      },
    });
  }
  findAll() {
    return this.prisma.product.findMany();
  }
  findById(id: string): Promise<FoundProduct[]> {
    return this.prisma.$queryRaw`
      SELECT
        p.*,
        COALESCE(AVG(c.rating), 0) AS average_rating,
        COALESCE(COUNT(c.id), 0)::int AS comment_count,
        JSON_AGG(pp.photo_url) AS photo_urls
      FROM products AS p
      LEFT JOIN comments AS c ON p.id = c.product_id
      LEFT JOIN product_photos AS pp ON p.id = pp.product_id
      WHERE p.id = ${id}
      GROUP BY p.id;
    `;
  }
  findBySlug(slug: string) {
    return this.prisma.product.findUnique({
      where: { slug },
    });
  }
  update(id: string, data: UpdateProductDto) {
    return this.prisma.product.update({
      where: { id },
      data,
    });
  }
  delete(id: string) {
    return this.prisma.product.delete({
      where: { id },
    });
  }
  createPhoto(id: string, data: ProductPhotoType[]) {
    return this.prisma.productPhoto.createMany({
      data: data.map((photo) => ({
        ...photo,
        productId: id,
      })),
    });
  }
}
