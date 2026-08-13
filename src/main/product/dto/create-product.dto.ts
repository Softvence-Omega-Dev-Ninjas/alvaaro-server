import { ApiProperty } from '@nestjs/swagger';
import { CategoryType } from '@prisma/client';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Name of the product',
    example: 'iPhone 13 Pro Max',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Description of the product',
    example: 'A brand new iPhone 13 Pro Max with 256GB storage',
  })
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Price of the product',
    example: 999.99,
  })
  @IsString()
  price: number;

  @ApiProperty({
    description: 'State where the product is located',
    example: 'California',
  })
  @IsString()
  state: string;

  @ApiProperty({
    description: 'City where the product is located',
    example: 'Los Angeles',
  })
  @IsString()
  city: string;

  @ApiProperty({
    description: 'ZIP code of the product location',
    example: '90001',
  })
  @IsString()
  zip: string;

  @ApiProperty({
    description: 'Address of the product location',
    example: '123 Main St, Los Angeles, CA 90001',
  })
  @IsString()
  address: string;

  // @ApiProperty({
  //   description: 'Country where the product is located',
  //   example: 'USA',
  // })
  // @IsString()
  // country: string;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'file',
      format: 'binary',
    },
  })
  images?: Express.Multer.File[];

  @ApiProperty({ enum: CategoryType })
  @IsEnum(CategoryType)
  category: CategoryType;

  @ApiProperty({
    type: Boolean,
    description: 'Is the product premium?',
    example: false,
  })
  @IsBoolean({ message: 'premium must be true or false (boolean)' })
  @IsOptional()
  isExclusive?: boolean;
}
