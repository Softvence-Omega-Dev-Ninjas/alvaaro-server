import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ContactSellerDto {
  @ApiProperty({
    example: 'Alvaro',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'user@gmail.com',
  })
  @IsString()
  email: string;

  @ApiProperty({
    example: '019238848399',
  })
  @IsString()
  phone: string;

  @ApiPropertyOptional({
    example: 'I am interested in your listing.',
  })
  @IsOptional()
  @IsString()
  message: string;
}
