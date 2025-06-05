import { IsBoolean, IsNotEmpty, IsString } from "class-validator"

export class UpdateCardRequestDto {
	@IsNotEmpty({ message: "Не указан name" })
	@IsString({ message: "name должен быть строкой" })
	name?: string

	@IsNotEmpty({ message: "Не указан content" })
	@IsString({ message: "content должен быть строкой" })
	content?: string

	@IsNotEmpty({ message: "Не указан isPublic" })
	@IsBoolean({ message: "isPublic должен быть булевым значением" })
	isPublic?: boolean
}
