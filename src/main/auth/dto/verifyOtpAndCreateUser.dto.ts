import { ApiProperty } from "@nestjs/swagger"
import { IsEmail } from "class-validator"

export class VerifyOtpAndCreateUserDto {
	@ApiProperty({
		example: "shantohmmm@gmail",
		description: "Email address associated with the OTP"
	})
	@IsEmail()
	email: string

	@ApiProperty({
		example: "123456",
		description: "One-Time Password (OTP) sent to the email"
	})
	otp: string
}
