import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty } from 'class-validator';
import { CreateCarDto } from 'src/main/car/dto/create-car.dto';
import { CreateJewelleryDto } from 'src/main/jwellery/dto/create-jwellery.dto';
import { CreateRealEstateDto } from 'src/main/real-estate/dto/create-real-estate.dto';
import { CreateWatchDto } from 'src/main/watch/dto/create-watch.dto';
import { CreateYachtDto } from 'src/main/yacht/dto/create-yacht.dto';

export class UpdateProductDto {
  @ApiProperty({ description: 'Product name', example: 'Luxury Watch' })
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Product description',
    example: 'A premium luxury watch with diamond finish.',
  })
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Product price', example: '2500' })
  @IsString()
  price?: number;

  @ApiPropertyOptional({ description: 'Zip', example: '1234' })

  @IsString()
  zip?: string;

  @ApiPropertyOptional({ description: 'City', example: 'Los Angeles' })

  @IsString()
  city?: string;

  @ApiPropertyOptional({ description: 'State', example: 'California' })

  @IsString()
  state?: string;

  @ApiPropertyOptional({ description: 'Address', example: '1234 Sunset Blvd' })

  @IsString()
  address?: string;

  @ApiPropertyOptional({
    description: 'Trending rank (1 = most trending)',
  })

  @IsNumber()
  trending?: number;

  @ApiPropertyOptional({
    description: 'Array of product images',

  })

  images?: string[];

  RealEstate?: CreateRealEstateDto;
  Car?: CreateCarDto;
  Watch?: CreateWatchDto;
  Yacht?: CreateYachtDto;
  Jewellery?: CreateJewelleryDto;
}
