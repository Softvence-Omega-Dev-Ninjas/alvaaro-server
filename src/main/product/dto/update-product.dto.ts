import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';
import { CreateCarDto } from 'src/main/car/dto/create-car.dto';
import { CreateJewelleryDto } from 'src/main/jwellery/dto/create-jwellery.dto';
import { CreateRealEstateDto } from 'src/main/real-estate/dto/create-real-estate.dto';
import { CreateWatchDto } from 'src/main/watch/dto/create-watch.dto';
import { CreateYachtDto } from 'src/main/yacht/dto/create-yacht.dto';

export class UpdateProductDto {
  @ApiPropertyOptional({ description: 'Product name', example: 'Luxury Watch' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Product description',
    example: 'A premium luxury watch with diamond finish.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Product price', example: '2500' })
  @IsOptional()
  @IsString()
  price?: string;

  @ApiPropertyOptional({
    description: 'Trending rank (1 = most trending)',
  })
  @IsOptional()
  @IsNumber()
  trending?: number;

  @ApiPropertyOptional({
    description: 'Array of product images',
    type: 'array',
    items: { type: 'string', format: 'binary' },
  })
  @IsOptional()
  images?: Express.Multer.File[];

  RealEstate?: CreateRealEstateDto;
  Car?: CreateCarDto;
  Watch?: CreateWatchDto;
  Yacht?: CreateYachtDto;
  Jewellery?: CreateJewelleryDto;
}
