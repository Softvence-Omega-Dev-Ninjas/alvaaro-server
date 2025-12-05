import { IsEmail, IsOptional, IsString } from 'class-validator';

export enum VStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
}

export enum SStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

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

  @ApiProperty({ enum: VStatus, required: false })
  @IsOptional()
  v_status?: VStatus;

  @ApiProperty({ enum: SStatus, required: false })
  @IsOptional()
  s_status?: SStatus;
}
