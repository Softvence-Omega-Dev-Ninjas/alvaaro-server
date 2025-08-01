import { IsEmail, IsOptional, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
export class UserSearchPayload {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  fullName?: string;

  @ApiProperty({ required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  v_status?: 'PENDING' | 'VERIFIED' | 'REJECTED';

  @ApiProperty()
  @IsString()
  @IsOptional()
  s_status?: string; // 'active' or 'inactive'
}
