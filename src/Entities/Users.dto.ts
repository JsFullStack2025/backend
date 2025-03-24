import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUsersDto {
    @ApiProperty({ description: "login", nullable: false })
    @IsNotEmpty({ message: 'Не заполнен username' })
    @IsString({ message: 'Please Enter Valid Name' })
    username: string;

    @ApiProperty({ description: "password in argon2 hash", nullable: false })
    @IsNotEmpty({ message: 'Не заполнен password' })
    password: string;

    @ApiProperty({ description: "email", nullable: true })
    @IsEmail()
    email?: string;
}

export class UpdateUserDto extends CreateUsersDto {
    @ApiProperty({ description: "id пользователя", nullable: true })
    @IsNotEmpty({ message: 'Не заполнен id пользователя' })
    id: number;
}

export class UpdateUserTokenDto {
    id: number;
    refreshToken: string;
    refreshTokenExp: Date;
}