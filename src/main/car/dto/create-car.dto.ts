// dto/create-car.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
import { CreateProductDto } from 'src/main/product/dto/create-product.dto';

export class CreateCarDto extends CreateProductDto {
  @ApiProperty({ description: 'Condition of the car', example: 'New' })
  @IsString()
  @IsNotEmpty()
  condition: string;

  @ApiProperty({ description: 'Manufacture of the car', example: 'Toyota' })
  @IsString()
  @IsNotEmpty()
  manufacture: string;

  @ApiProperty({ description: 'Year of manufacture', example: '2020' })
  @IsString()
  @IsNotEmpty()
  year: string;

  @ApiProperty({ description: 'Model of the car', example: 'Camry' })
  @IsString()
  @IsNotEmpty()
  model: string;

  @ApiProperty({ description: 'Body style of the car', example: 'Sedan' })
  @IsString()
  @IsNotEmpty()
  carBodyStyle: string;

  @ApiProperty({
    description: 'Transmission type of the car',
    example: 'Automatic',
  })
  @IsString()
  @IsNotEmpty()
  transmission: string;

  @ApiProperty({
    description: 'Mileage of the car',
    example: '10000',
  })
  @IsString()
  @IsNotEmpty()
  mileage: string;

  @ApiProperty({
    required: true,
    description: 'Number of cylinders in the car',
    example: '4',
  })
  @IsString()
  @IsNotEmpty()
  @IsString()
  @IsNotEmpty()
  cylinders: string;

  @ApiProperty({
    required: true,
    example: 'AWD',
  })
  @IsString()
  @IsNotEmpty()
  tractionType: string;

  @ApiProperty({
    required: true,
    example: 'Gasoline',
  })
  @IsString()
  @IsNotEmpty()
  fuelType: string;
}
