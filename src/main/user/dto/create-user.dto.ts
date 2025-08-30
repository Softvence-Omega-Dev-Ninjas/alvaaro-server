import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class CreateUserDto {
	@ApiProperty({
		example: "User",
		description: "Full name of the user"
	})
	@IsString()
	@IsNotEmpty()
	fullName: string

	@ApiProperty({
		example: "shantohmmm@gmail.com",
		description: "User email address"
	})
	@IsEmail()
	@IsOptional()
	email: string

	@ApiProperty({
		example: "123456",
		description: "User password"
	})
	@IsString()
	@IsNotEmpty()
	password: string

	@ApiProperty({
		description: "Photo showing the problem",
		type: "array",
		items: { type: "file", format: "binary" },
		required: true
	})
	@IsNotEmpty({ each: true })
	images: Express.Multer.File[]
}
