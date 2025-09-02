import { ApiProperty } from '@nestjs/swagger';
import { CategoryType } from '@prisma/client';
import { IsBoolean, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsString()
  price: string;

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
  isExclusive: boolean;
}
