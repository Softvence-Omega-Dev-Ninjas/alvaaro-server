import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty({
    description: 'The ID of the package being purchased',
    example: 'package_12345',
  })
  packageId: string;
}
