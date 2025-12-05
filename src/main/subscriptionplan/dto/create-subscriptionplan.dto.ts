import { ApiProperty } from '@nestjs/swagger';
import { SubscriptionPlanType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateSubscriptionPlanDto {
  @ApiProperty({
    enum: SubscriptionPlanType,
    example: SubscriptionPlanType.BASIC,
  })
  @IsEnum(SubscriptionPlanType)
  type: SubscriptionPlanType;

  @ApiProperty({ example: '30 days' })
  @IsString()
  @IsNotEmpty()
  length: string;

  @ApiProperty({ example: 10, type: Number })
  @IsNumber()
  @IsNotEmpty()
  listingLimit: string;

  @ApiProperty({ example: '100.99' })
  @IsString()
  @IsNotEmpty()
  price: string;

  @ApiProperty({ example: ['Feature 1', 'Feature 2', 'Feature 3'] })
  @IsString()
  features: string[];
}
