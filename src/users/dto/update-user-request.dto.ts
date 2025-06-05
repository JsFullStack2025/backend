import { IsNotEmpty, IsString } from "class-validator"

export class UpdateUserRequestDto {
	@IsNotEmpty({ message: "Не указан username" })
	@IsString({ message: "username должен быть строкой" })
	username: string
}
