import { ApiProperty } from '@nestjs/swagger';
import { CategoryType } from '@prisma/client';
import { Transform } from 'class-transformer';
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
  // @Transform(({ value }) => {
  //   if (typeof value === 'string') {
  //     if (value= 'true') return true;
  //     if (value= 'false') return false;
  //   }
  //   console.log({value},'value')
  //   return Boolean(value); // fallback: handles 0, 1, etc.
  // })
  @IsBoolean({ message: 'premium must be true or false (boolean)' })
  premium: string;
  // @ApiProperty({ required: false })
  // @IsOptional()
  // realEstateDetails?: CreateRealEstateDto;
}
