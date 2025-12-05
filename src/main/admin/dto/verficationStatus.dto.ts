import { ApiProperty } from '@nestjs/swagger';

enum VerificationStatus {
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
}

export class VerificationStatusDto {
  @ApiProperty({
    example: 'VERIFIED',
    description: 'Verification status of the seller',
    enum: VerificationStatus,
    enumName: 'VerificationStatus',
  })
  status: 'VERIFIED' | 'REJECTED';
}
