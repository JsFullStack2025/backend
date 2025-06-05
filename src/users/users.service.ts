import { HttpException, HttpStatus, Injectable } from "@nestjs/common"
import { Cards, Users } from "@prisma/client"

import {
	UpdatePasswordDto,
	UpdateUserDto,
	UpdateUserTokenDto
} from "@/Entities/Users.dto"
import { RegisterRequestDto } from "@/auth/dto/register-request.dto"

import { checkPasswordHash, getPasswordHash } from "../auth/hash.helper"
import { PrismaService } from "../services/prisma.service"

@Injectable()
export class UsersService {
	constructor(private prisma: PrismaService) {}
	test(): string {
		return "test"
	}

	async userById(userid: number): Promise<Users | null> {
		return this.prisma.users.findUnique({
			where: { id: userid }
		})
	}
	async getUserCards(userid: number): Promise<Cards[] | null> {
		return this.prisma.cards.findMany({
			where: { authorId: userid }
		})
	}
	async users(): Promise<Users[]> {
		return this.prisma.users.findMany()
	}

	async createUser(userdata: RegisterRequestDto): Promise<Users> {
		const pwd = await getPasswordHash(userdata.password)
		userdata.password = pwd
		return this.prisma.users.create({
			data: {
				email: userdata.email,
				username: userdata.username,
				password: userdata.password
			}
		})
	}

	async updatePassword(req: UpdatePasswordDto) {
		const user = await this.prisma.users.findFirst({
			where: { id: req.id }
		})
		if (!user) {
			throw new HttpException("User not found", HttpStatus.NOT_FOUND)
		}

		const isPasswordValid = await checkPasswordHash(
			req.oldpassword,
			user.password
		)
		if (!isPasswordValid) {
			throw new HttpException(
				"Wrong old password",
				HttpStatus.BAD_REQUEST
			)
		}

		const hashedNewPassword = await getPasswordHash(req.newpassword)

		return this.prisma.users.update({
			where: { id: req.id },
			data: { password: hashedNewPassword }
		})
	}

	async updateUser(userData: UpdateUserDto): Promise<Users> {
		try {
			return await this.prisma.users.update({
				where: { id: userData.id },
				data: {
					username: userData.username
				}
			})
		} catch (error) {
			throw new HttpException(
				`Failed to update user: ${error.message || String(error)}`,
				HttpStatus.BAD_REQUEST
			)
		}
	}

	async updateUserRefreshToken(userData: UpdateUserTokenDto): Promise<Users> {
		const user = await this.prisma.users.findUnique({
			where: { id: userData.id }
		})

		if (!user) {
			throw new HttpException("User not found", HttpStatus.NOT_FOUND)
		}

		return this.prisma.users.update({
			where: { id: userData.id },
			data: userData
		})
	}

	async deleteUser(userId: number): Promise<Users> {
		return this.prisma.users.delete({
			where: { id: userId }
		})
	}

	async findByEmail(email: string): Promise<Users | undefined | null> {
		return this.prisma.users.findFirst({
			where: { email }
		})
	}

	async findAny(params: any): Promise<Users | undefined | null> {
		return this.prisma.users.findFirst(params)
	}
	async checkUniqueEmail(email: string): Promise<boolean> {
		const user = await this.prisma.users.findFirst({
			where: { email }
		})

		return user !== null
	}
}
