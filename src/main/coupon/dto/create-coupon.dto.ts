import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreateCouponDto {
  @ApiProperty({ example: 'Basic', description: 'Coupon name' })
  @IsString()
  @IsNotEmpty()
  couponName: string;

  @ApiProperty({ example: 'DISCOUNT2025', description: 'Coupon code' })
  @IsString()
  @IsNotEmpty()
  couponCode: string;

  @ApiProperty({ example: '15', description: 'Discount percentage as string' })
  @IsString()
  @IsNotEmpty()
  percent_off: string;

  @ApiProperty({
    example: '2025-08-01T00:00:00.000Z',
    description: 'Start date of the coupon',
  })
  @IsDate()
  @Type(() => Date)
  start_date: Date;

  @ApiProperty({
    example: '2025-08-31T23:59:59.000Z',
    description: 'Last redeem date',
  })
  @IsDate()
  @Type(() => Date)
  redeem_by: Date;
}
