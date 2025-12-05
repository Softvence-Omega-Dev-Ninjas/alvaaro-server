import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePaymentDto } from './create-payment.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdatePaymentDto {
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

export class SaveSessionDto {
  @ApiProperty({
    description: 'The ID of the Stripe checkout session to be saved',
    example: 'cs_test_a1b2c3d4e5f6g7h8i9j0',
  })
  @IsNotEmpty()
  sessionId: string;
}
