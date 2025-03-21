import { ApiProperty } from "@nestjs/swagger";

export class UsersDto {
    @ApiProperty({ description: "login", nullable: false })
    login: string;

    @ApiProperty({ description: "email", nullable: true })
    email: string;

    @ApiProperty({ description: "email", nullable: false })
    hash: string;
}