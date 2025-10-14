import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UploadedFiles,
  UseInterceptors,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import {
  CreateProductServiceDto,
  UpdateProductServiceDto,
} from './product.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileValidationPipe } from '../shared/pipe/file-validation.pipe';
import { JwtGuard } from '../shared/guard/jwt.guard';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @UseGuards(JwtGuard)
  @Post()
  @UseInterceptors(FilesInterceptor('photos'))
  create(
    @Body() data: CreateProductServiceDto,
    @UploadedFiles(new FileValidationPipe()) photos: Express.Multer.File[],
  ) {
    return this.productService.create(data, photos);
  }
  @Get()
  findAll() {
    return this.productService.findAll();
  }
  @Get(':id')
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.productService.findById(id);
  }
  @UseGuards(JwtGuard)
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateProductServiceDto,
  ) {
    return this.productService.update(id, data);
  }
  @UseGuards(JwtGuard)
  @Delete(':id')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.productService.delete(id);
  }
  @UseGuards(JwtGuard)
  @Post(':id/photos')
  @UseInterceptors(FilesInterceptor('photos'))
  addPhoto(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFiles(new FileValidationPipe()) photos: Express.Multer.File[],
  ) {
    return this.productService.addPhoto(id, photos);
  }
}
