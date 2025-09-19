import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumberString } from 'class-validator';

export class ProductSearchQueryDto {
  @ApiPropertyOptional({
    description: 'Search by address, city, state, or zip',
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ description: 'Minimum price filter' })
  @IsOptional()
  @IsNumberString()
  minPrice?: string;

  @ApiPropertyOptional({ description: 'Maximum price filter' })
  @IsOptional()
  @IsNumberString()
  maxPrice?: string;
}
