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

export class UpdateUserDto {
    @ApiProperty({ description: "id пользователя", nullable: false })
    @IsNotEmpty({ message: 'Не заполнен id пользователя' })
    id: number;
    first_name?:string;
    middle_name?:string;
    last_name?:string;
    email?:string;
}

export class UpdateUserTokenDto {
    @ApiProperty({ description: "id пользователя", nullable: false })
    @IsNotEmpty({ message: 'Не заполнен id пользователя' })
    id: number;
    refreshToken: string;
    refreshTokenExp: Date;
}