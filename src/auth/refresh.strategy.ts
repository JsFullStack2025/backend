import { BadRequestException, Injectable } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { Request } from "express"
import { ExtractJwt, Strategy } from "passport-jwt"

import { AuthService } from "./auth.service"

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, "refresh") {
	constructor(private authService: AuthService) {
		super({
			ignoreExpiration: true,
			passReqToCallback: true,
			secretOrKey: process.env.JWT_SECRET!,
			jwtFromRequest: ExtractJwt.fromExtractors([
				(request: Request) => {
					const data = request?.cookies["session"]
					if (!data) {
						return null
					}
					return data.token
				}
			])
		})
	}

	async validate(req: Request, payload: any) {
		if (!payload) {
			throw new BadRequestException("invalid jwt token")
		}
		const data = req?.cookies["session"]
		if (!data?.refreshToken) {
			throw new BadRequestException("invalid refresh token")
		}
		const user = await this.authService.validRefreshToken(
			payload.username,
			data.refreshToken
		)
		if (!user) {
			throw new BadRequestException("token expired")
		}

		return user
	}
}
