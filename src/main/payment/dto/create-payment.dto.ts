import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty({
    description: 'The ID of the package being purchased',
    example: 'package_12345',
  })
  packageId: string;

  @ApiProperty({
    description: 'Optional coupon code for discounts',
    example: 'DISCOUNT2025',
    required: false,
  })
  couponCode?: string;
}
