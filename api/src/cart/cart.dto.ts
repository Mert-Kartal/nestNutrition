import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';

export class CreateCartDto {
  @IsNotEmpty()
  @IsString()
  productId: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class UpdateCartDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  quantity: number;
}

export class CartItemDto {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  total_price: number;
  grand_total: number;
}
