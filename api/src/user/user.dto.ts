import {
  IsString,
  IsOptional,
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
} from 'class-validator';
import { OmitType, PartialType } from '@nestjs/mapped-types';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  password?: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsPhoneNumber('TR')
  phone?: string;

  @IsOptional()
  photo?: string;
}

export class UpdateUserServiceDto extends OmitType(UpdateUserDto, [
  'password',
  'fullName',
  'photo',
  'email',
]) {}
