import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductRepository } from './product.repository';
import {
  CreateProductServiceDto,
  UpdateProductServiceDto,
  UpdateProductDto,
} from './product.dto';
import slugify from 'slugify';
import { CategoryService } from '../category/category.service';
import { FileUploadProducerService } from '../file-upload/file-upload.producer.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly categoryService: CategoryService,
    private readonly fileUploadProducerService: FileUploadProducerService,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  async create(data: CreateProductServiceDto, photos: Express.Multer.File[]) {
    await this.categoryService.findById(data.categoryId);
    const slug = slugify(data.name, {
      lower: true,
      replacement: '-',
      trim: true,
    });
    const existSlug = await this.productRepository.findBySlug(slug);
    if (existSlug) {
      throw new BadRequestException('Slug already exists');
    }
    const shortDescription =
      data.description.length > 50
        ? data.description.substring(0, 50) + '...'
        : data.description;
    const longDescription = data.description;
    const photoData = photos.map((photo) => {
      return {
        photoUrl: photo.filename,
        photoSize: photo.size,
      };
    });
    const dataToCreate = {
      categoryId: data.categoryId,
      name: data.name,
      slug,
      shortDescription,
      longDescription,
      price: data.price,
      stock_quantity: data.stock_quantity,
      primaryPhoto: photoData[0].photoUrl,
      productPhotos: photoData,
    };
    return this.productRepository.create(dataToCreate);
  }
  findAll() {
    return this.productRepository.findAll();
  }
  async findById(id: string) {
    const product = await this.productRepository.findById(id);
    if (product.length === 0) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }
  async update(id: string, data: UpdateProductServiceDto) {
    await this.findById(id);
    const updatePlain: UpdateProductDto = {};
    for (const key in data) {
      if (data[key] === undefined || data[key] === null) continue;
      switch (key) {
        case 'categoryId':
          await this.categoryService.findById(data.categoryId as string);
          updatePlain.categoryId = data.categoryId;
          break;
        case 'name':
          {
            updatePlain.name = data.name;
            const slug = slugify(data.name as string, {
              lower: true,
              replacement: '-',
              trim: true,
            });
            const existSlug = await this.productRepository.findBySlug(slug);
            if (existSlug && existSlug.id !== id) {
              throw new BadRequestException('Slug already exists');
            }
            updatePlain.slug = slug;
          }
          break;
        case 'description': {
          const editedDescription =
            (data.description as string).substring(0, 50) + '...';
          updatePlain.shortDescription =
            editedDescription.length > 50
              ? editedDescription
              : data.description;
          updatePlain.longDescription = data.description;
          break;
        }
        case 'stock_quantity':
          updatePlain.stock_quantity = data.stock_quantity;
          this.eventEmitter.emit('product.stock_quantity.updated', {
            id,
            stock_quantity: data.stock_quantity,
          });
          break;
        default:
          updatePlain[key] = data[
            key
          ] as (typeof updatePlain)[keyof UpdateProductDto];
          break;
      }
    }
    return this.productRepository.update(id, updatePlain);
  }
  async delete(id: string) {
    const product = await this.productRepository.findById(id);
    if (product.length === 0) {
      throw new NotFoundException('Product not found');
    }
    await this.fileUploadProducerService.removeFileUploadJob(
      product[0].photo_urls.map((photo) => photo),
    );
    await this.productRepository.delete(id);
    return 'Product deleted successfully';
  }
  async addPhoto(id: string, photos: Express.Multer.File[]) {
    const product = await this.productRepository.findById(id);
    if (product.length === 0) {
      throw new NotFoundException('Product not found');
    }
    if (
      product[0].photo_urls.length >= 10 ||
      product[0].photo_urls.length + photos.length > 10
    ) {
      throw new BadRequestException('Product already has 10 photos');
    }
    const photoData = photos.map((photo, index) => {
      return {
        photoUrl: photo.filename,
        photoSize: photo.size,
        order: product[0].photo_urls.length + index,
      };
    });
    return this.productRepository.createPhoto(id, photoData);
  }
  //will add update and delete photos
}
