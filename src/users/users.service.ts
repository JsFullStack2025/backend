import { HttpException, HttpStatus, Injectable } from "@nestjs/common"
import { Cards, Users } from "@prisma/client"

import {
	CreateUsersDto,
	UpdatePasswordDto,
	UpdateUserDto,
	UpdateUserTokenDto
} from "@/Entities/Users.dto"

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

	async createUser(userdata: CreateUsersDto): Promise<Users> {
		const pwd = await getPasswordHash(userdata.password)
		userdata.password = pwd
		return this.prisma.users.create({
			data: userdata
		})
	}

	async updatePassword(req: UpdatePasswordDto) {
		const user = await this.prisma.users.findFirst({
			where: { id: req.id }
		})
		if (user === null)
			throw new HttpException("User not found", HttpStatus.NOT_FOUND)
		if (
			(await checkPasswordHash(req.oldpassword, user.password)) === false
		) {
			throw new HttpException(
				"Wrong old password",
				HttpStatus.BAD_REQUEST
			)
		}
		user.password = await getPasswordHash(req.newpassword)
		return this.prisma.users.update({
			where: { id: req.id },
			data: user
		})
	}

	async updateUser(userdata: UpdateUserDto) {
		try {
			const res = await this.prisma.users.update({
				where: { id: userdata.id },
				data: userdata
			})
			//console.log("updateUser", res)
			return res
		} catch (error) {
			//console.log("updateUser_error", error)
			throw new HttpException(String(error), HttpStatus.BAD_REQUEST)
		}
	}

	async updateUserRefreshToken(userData: UpdateUserTokenDto): Promise<Users> {
		const user = await this.findAny({
			where: { id: userData.id }
		})
		if (user === null)
			throw new HttpException("User not found", HttpStatus.NOT_FOUND)
		return this.prisma.users.update({
			where: { id: userData.id },
			data: userData
		})
	}

	async deleteUser(userid: number): Promise<Users> {
		return this.prisma.users.delete({
			where: { id: userid }
		})
	}

	async findOne(userName: string): Promise<Users | undefined | null> {
		return this.prisma.users.findFirst({ where: { username: userName } })
	}
	async findAny(params: any): Promise<Users | undefined | null> {
		return this.prisma.users.findFirst(params)
	}
	async checkUniqueEmail(emailToFind: string): Promise<boolean> {
		const user = await this.prisma.users.findFirst({
			where: { email: emailToFind }
		})
		if (user !== null) return true
		return false
	}
}
