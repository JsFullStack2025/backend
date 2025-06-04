import {
	Body,
	Controller,
	Get,
	Post,
	Req,
	Res,
	UseGuards
} from "@nestjs/common"
import { Response, response } from "express"

import { CreateUsersDto, UpdatePasswordDto } from "@/Entities/Users.dto"
import { UsersService } from "@/users/users.service"

import { AuthService } from "./auth.service"
import { JwtAuthGuard } from "./jwt.guard"
import { JwtPayload } from "./jwt.payload"
import { LocalAuthGuard } from "./local.guard"
import { RefreshAuthGuard } from "./refresh.guard"

@Controller("auth")
export class AuthController {
	constructor(
		private authService: AuthService,
		private usersService: UsersService
	) {}

	@Post("registration")
	async registerUser(
		@Body() req: CreateUsersDto,
		@Res({ passthrough: true }) res: Response
	) {
		console.log(req.username)
		const user = await this.usersService.findOne(req.username)
		if (user) {
			//throw 'User already exists';
			return {
				error: true,
				massage: `Пользователь с Login=${req.username} уже зарегистрирован`
			}
			//throw new HttpException(`Пользователь с email=${user.email} уже зарегистрирован`, HttpStatus.CONFLICT);
		}
		const newUser = await this.usersService.createUser(req)

		return await this.authService.getUserToken(newUser, res)
	}

	@Post("changepassword")
	@UseGuards(JwtAuthGuard)
	async changePassword(req: UpdatePasswordDto) {
		return this.usersService.updatePassword(req)
	}

	@Post("login")
	@UseGuards(LocalAuthGuard)
	async login(@Req() req, @Res({ passthrough: true }) res: Response) {
		console.log(req.user)
		return await this.authService.getUserToken(req.user, res)
	}

	@Post("logout")
	@UseGuards(JwtAuthGuard)
	logout() {
		response.clearCookie("auth-cookie")
		return {}
	}

	@Get("testjwt")
	@UseGuards(JwtAuthGuard)
	testjwt(@Req() req) {
		return { Work: "Ok", user: req.user }
	}

	@Get("refresh-tokens")
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

		res.cookie("auth-cookie", secretData, { httpOnly: true })
		return { msg: "success", user: req.user }
	}
}
