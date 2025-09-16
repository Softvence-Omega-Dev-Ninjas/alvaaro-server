import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateSellerDto {
  @IsString()
  companyName?: string;

  @ApiProperty({ example: 'https://alvaaro.com' })
  @IsString()
  companyWebsite?: string;

  @ApiProperty({ example: '01837588068' })
  phone?: string;

  @ApiProperty({ example: 'House 42, Road 7, Block C' })
  @IsString()
  address?: string;

  @ApiProperty({ example: 'Dhaka' })
  @IsString()
  state?: string;

  @ApiProperty({ example: 'Dhaka' })
  @IsString()
  city?: string;

  @ApiProperty({ example: '1212' })
  @IsString()
  zip?: string;
}
