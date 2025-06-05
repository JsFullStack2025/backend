import { IsNotEmpty, IsString } from "class-validator"

export class CreateCardRequestDto {
	@IsNotEmpty({ message: "Не указан name" })
	@IsString({ message: "name должен быть строкой" })
	name: string
}
