import { ApiProperty } from "@nestjs/swagger";

export class CreateUsersDto {
    @ApiProperty({ description: "login", nullable: false })
    login: string;

    @ApiProperty({ description: "email", nullable: true })
    email: string;

    @ApiProperty({ description: "email", nullable: false })
    hash: string;
}

export class UpdateUserDto extends CreateUsersDto {
    @ApiProperty({ description: "id пользователя", nullable: true })
    id: number;
}