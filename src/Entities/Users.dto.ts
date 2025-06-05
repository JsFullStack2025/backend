import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class CreateUsersDto {
	@ApiProperty({ description: "login", nullable: false })
	@IsNotEmpty({ message: "Не заполнен username" })
	@IsString({ message: "Please Enter Valid Name" })
	username: string

	@ApiProperty({ description: "password in argon2 hash", nullable: false })
	@IsNotEmpty({ message: "Не заполнен password" })
	password: string

	@ApiProperty({ description: "email", nullable: false })
	@IsNotEmpty({ message: "Не заполнен email" })
	@IsEmail()
	email: string
}

export class UpdateUserDto {
	@ApiProperty({ description: "id пользователя", nullable: false })
	@IsNotEmpty({ message: "Не заполнен id пользователя" })
	id: number
	username?: string
	fio?: string
	foto?: string
	first_name?: string
	middle_name?: string
	last_name?: string
	email?: string
}

export class UpdateUserTokenDto {
	@ApiProperty({ description: "id пользователя", nullable: false })
	@IsNotEmpty({ message: "Не заполнен id пользователя" })
	id: number
	refreshToken: string
	refreshTokenExp: Date
}

export class UpdatePasswordDto {
	@ApiProperty({ description: "id пользователя", nullable: false })
	@IsNotEmpty({ message: "Не заполнен id пользователя" })
	id: number

	@ApiProperty({ description: "Old password" })
	@IsNotEmpty({ message: "Не заполнен oldpassword" })
	oldpassword: string

	@ApiProperty({ description: "Old password" })
	@IsNotEmpty({ message: "Не заполнен newpassword" })
	newpassword: string
}
