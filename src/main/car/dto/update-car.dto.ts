import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateCarDto {
  @ApiProperty({
    required: false,
    example: 'NEW',
  })
  @IsString()
  @IsNotEmpty()
  condition?: string;

  @ApiProperty({
    required: false,
    example: 'Toyota',
  })
  @IsString()
  @IsNotEmpty()
  manufacture?: string;

  @ApiProperty({
    required: false,
    example: '2020',
  })
  @IsString()
  @IsNotEmpty()
  year?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  model?: string;

  @ApiProperty({
    required: false,
    example: 'Sedan',
  })
  @IsString()
  @IsNotEmpty()
  carBodyStyle?: string;

  @ApiProperty({
    required: false,
    example: 'Automatic',
  })
  @IsString()
  @IsNotEmpty()
  transmission?: string;

  @ApiProperty({
    required: false,
    example: '10000',
  })
  @IsString()
  @IsNotEmpty()
  mileage?: string;

  @ApiProperty({
    required: false,
    example: '4',
  })
  @IsString()
  @IsNotEmpty()
  cylinders?: string;

  @ApiProperty({
    required: false,
    example: 'AWD',
  })
  @IsString()
  @IsNotEmpty()
  tractionType?: string;

  @ApiProperty({
    required: false,
    example: 'Gasoline',
  })
  @IsString()
  @IsNotEmpty()
  fuelType?: string;
}
