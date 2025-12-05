import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    example: 'User',
    description: 'Full name of the user',
  })
  @IsString()
  @IsOptional()
  fullName: string;



  @ApiPropertyOptional({
    description: 'Photo  The profile image of the and is required'
  })
  images: string;
}
