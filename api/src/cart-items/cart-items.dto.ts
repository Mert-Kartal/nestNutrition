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
