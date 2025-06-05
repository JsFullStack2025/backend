import {
	Body,
	Controller,
	Get,
	Post,
	Req,
	Res,
	UnauthorizedException,
	UseGuards
} from "@nestjs/common"
import { Response } from "express"

import { UpdatePasswordDto } from "../../src/Entities/Users.dto"
import { UsersService } from "../../src/users/users.service"

import { AuthService } from "./auth.service"
import { RegisterRequestDto } from "./dto/register-request.dto"
import { JwtAuthGuard } from "./jwt.guard"
import { JwtPayload } from "./jwt.payload"
import { RefreshAuthGuard } from "./refresh.guard"

@Controller("auth")
export class AuthController {
	constructor(
		private authService: AuthService,
		private usersService: UsersService
	) {}

	@Post("register")
	async registerUser(
		@Body() data: RegisterRequestDto,
		@Res({ passthrough: true }) res: Response
	) {
		console.log(data.username)
		const user = await this.usersService.findByEmail(data.email)
		if (user) {
			//throw 'User already exists';
			return {
				error: true,
				massage: `Пользователь с Email=${data.username} уже зарегистрирован`
			}
			//throw new HttpException(`Пользователь с email=${user.email} уже зарегистрирован`, HttpStatus.CONFLICT);
		}
		const newUser = await this.usersService.createUser(data)

		return await this.authService.getUserToken(newUser, res)
	}

	@Post("changepassword")
	@UseGuards(JwtAuthGuard)
	async changePassword(req: UpdatePasswordDto) {
		return this.usersService.updatePassword(req)
	}

	@Post("login")
	async login(
		@Body() data: RegisterRequestDto,
		@Res({ passthrough: true }) res: Response
	) {
		const payload = await this.authService.validateUserCredentials(
			data.email,
			data.password
		)
		if (payload == null) {
			throw new UnauthorizedException()
		}

		const user = await this.usersService.findByEmail(payload.email)
		return await this.authService.getUserToken(user!, res)
	}

	@Post("logout")
	@UseGuards(JwtAuthGuard)
	logout(@Res({ passthrough: true }) res: Response) {
		res.clearCookie("session")
		return { message: "Logout success" }
	}

	@Get("testjwt")
	@UseGuards(JwtAuthGuard)
	testjwt(@Req() req) {
		return { Work: "Ok", user: req.user }
	}

	@Get("refresh")
	@UseGuards(RefreshAuthGuard)
	async regenerateTokens(
		@Req() req,
		@Res({ passthrough: true }) res: Response
	) {
		const token = await this.authService.getJwtToken(req.user as JwtPayload)
		const refreshToken = await this.authService.getRefreshToken(req.user.id)
		const secretData = {
			token,
			refreshToken
		}

		res.cookie("session", secretData, { httpOnly: true })

		const userData = await this.usersService.findByEmail(
			req.user.email ?? ""
		)
		return {
			accessToken: token,
			user: userData
		}
	}
}
