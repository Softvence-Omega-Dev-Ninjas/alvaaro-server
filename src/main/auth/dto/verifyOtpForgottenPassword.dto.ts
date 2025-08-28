import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpForgottenPasswordDto {
  @ApiProperty({
    description: 'Email address of the user requesting OTP verification',
    example: 'shantohmmm@gmail.com',
  })
  email: string;

  @ApiProperty({
    description: 'One-Time Password (OTP) sent to the user',
    example: '123456',
  })
  otp: string;
  @ApiProperty({
    description: 'New password for the user',
    example: 'newPassword123',
  })
  newPassword: string;
}
