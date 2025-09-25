import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';
import { CreateProductDto } from 'src/main/product/dto/create-product.dto';

export class CreateRealEstateDto extends CreateProductDto {
  @ApiProperty({
    description: 'Number of bedrooms',
    example: '3',
  })
  @IsString()
  beds: string;

  @ApiProperty({
    description: 'Number of washrooms',
    example: '2',
  })
  @IsString()
  washroom: string;

  @ApiProperty({
    description: 'Size of the property in square feet',
    example: '1500',
  })
  @IsString()
  size: string;
  // @ApiProperty({ type: [String] }) @IsArray() text: string[];

  @ApiProperty({
    type: [String],
    example: ['Swimming Pool', 'Garage', 'Garden'],
  })
  @IsArray()
  features: string[];
}
