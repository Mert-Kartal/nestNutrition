import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateCategoryServiceDto,
  UpdateCategoryServiceDto,
} from './category.dto';
import { CategoryRepository } from './category.repository';
import slugify from 'slugify';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}
  async create(data: CreateCategoryServiceDto) {
    const slug = slugify(data.name, {
      lower: true,
      replacement: '-',
      trim: true,
    });
    const existSlug = await this.categoryRepository.findBySlug(slug);
    if (existSlug) {
      throw new BadRequestException('Slug already exists');
    }
    const maxOrder = await this.categoryRepository.findMaxOrder();
    const order = maxOrder ? maxOrder.order + 1 : 1;
    const dataToCreate = {
      ...data,
      slug,
      order,
    };
    return this.categoryRepository.create(dataToCreate);
  }
  findAll() {
    return this.categoryRepository.findAll();
  }
  async findById(id: string) {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }
  async update(id: string, data: UpdateCategoryServiceDto) {
    const category = await this.findById(id);
    if (category.order === data.order || category.name === data.name) {
      throw new BadRequestException('you cannot update the same order or name');
    }
    if (data.name) {
      const slug = slugify(data.name, {
        lower: true,
        replacement: '-',
        trim: true,
      });
      const existSlug = await this.categoryRepository.findBySlug(slug);
      if (existSlug) {
        throw new BadRequestException('Slug already exists');
      }
      await this.categoryRepository.update(id, { slug, name: data.name });
    }
    if (data.order) {
      const maxOrder = await this.categoryRepository.findMaxOrder();
      if (maxOrder && data.order > maxOrder.order) {
        throw new BadRequestException(
          'Order is greater than the maximum category order',
        );
      }
      await this.categoryRepository.switchOrder(category.order, data.order);
    }
    return 'Category updated successfully';
  }
  async delete(id: string) {
    const category = await this.findById(id);
    await this.categoryRepository.delete(id, category.order);
    return 'Category deleted successfully';
  }
}
