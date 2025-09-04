import { ApiProperty } from "@nestjs/swagger"

export class ResendOtpDto {
	@ApiProperty({
		example: "shantohmmm@gmail",
		description: "Email address to resend the OTP"
	})
	email: string
}
