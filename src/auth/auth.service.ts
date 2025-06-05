import { Injectable } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { Users } from "@prisma/client"
import * as argon2 from "argon2"
import * as moment from "moment"
import * as randomToken from "rand-token"

import { UpdateUserTokenDto } from "@/Entities/Users.dto"

import { UsersService } from "../users/users.service"

import { JwtPayload } from "./jwt.payload"

@Injectable()
export class AuthService {
	constructor(
		private usersService: UsersService,
		private jwtService: JwtService
	) {}

	async checkPasswordHash(password: string, hash: string): Promise<boolean> {
		return await argon2.verify(hash, password)
	}

	public async validateUserCredentials(
		email: string,
		password: string
	): Promise<JwtPayload | null> {
		console.log(email)
		const user = await this.usersService.findByEmail(email)
		console.log(user)
		if (user == null) {
			return null
		}

		const isValidPassword = await this.checkPasswordHash(
			password,
			user.password
		)
		if (!isValidPassword) {
			return null
		}

		const currentUser = new JwtPayload()
		currentUser.userId = user.id
		currentUser.email = user.email ?? ""
		return currentUser
	}

	public async getJwtToken(user: JwtPayload): Promise<string> {
		const payload = {
			...user
		}
		return this.jwtService.signAsync(payload)
	}

	public async getRefreshToken(userId: number): Promise<string> {
		const userDataToUpdate: UpdateUserTokenDto = {
			id: userId,
			refreshToken: randomToken.generate(16),
			refreshTokenExp: moment().day(1).toDate()
		}

		await this.usersService.updateUserRefreshToken(userDataToUpdate)
		return userDataToUpdate.refreshToken
	}

	public async validRefreshToken(
		useremail: string,
		refreshToken: string
	): Promise<JwtPayload | null> {
		const currentDate = moment().day(1).toDate()
		const user = await this.usersService.findAny({
			where: {
				email: useremail,
				refreshToken: refreshToken,
				refreshTokenExp: {
					gte: currentDate
				}
			}
		})

		if (!user) {
			return null
		}

		const currentUser = new JwtPayload()
		currentUser.userId = user.id
		currentUser.email = user.email ?? ""
		currentUser.isAdmin = user.isAdmin
		return currentUser
	}
	public async getUserToken(user: Users, res: any) {
		const currentUser = new JwtPayload()
		currentUser.userId = user.id
		currentUser.email = user.email ?? ""
		currentUser.isAdmin = user.isAdmin

		const token = await this.getJwtToken(currentUser)
		const refreshToken = await this.getRefreshToken(user.id)
		const secretData = {
			userId: user.id,
			userName: user.username,
			token,
			refreshToken
		}
		res.cookie("session", secretData, {
			//httpOnly: true,
			secure: process.env.NODE_ENV === "production", // Только для production
			sameSite: process.env.NODE_ENV === "strict", //'production' ? 'strict' : 'lax',
			maxAge: 60000 * 30
		})

		const userData = await this.usersService.findByEmail(user.email ?? "")
		return {
			accessToken: token,
			user: userData
		}
	}
}
