import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class RegisterRequestDto {
	@IsNotEmpty({ message: "Не указан email" })
	@IsEmail({}, { message: "Некорректный email" })
	email: string

	@IsNotEmpty({ message: "Не указан username" })
	@IsString({ message: "username должен быть строкой" })
	username: string

	@IsNotEmpty({ message: "Не указан password" })
	@IsString({ message: "password должен быть строкой" })
	password: string

	@IsNotEmpty({ message: "Не указан captcha" })
	@IsString({ message: "captcha должен быть строкой" })
	captcha: string
}
