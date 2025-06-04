import { Injectable, UnauthorizedException } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { Request } from "express"
import { ExtractJwt, Strategy } from "passport-jwt"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
	constructor() {
		super({
			ignoreExpiration: false,
			secretOrKey: process.env.JWT_SECRET!,
			jwtFromRequest: ExtractJwt.fromExtractors([
				(request: Request) => {
					if (!request?.cookies) return null
					const data = request?.cookies["auth-cookie"]
					if (!data) {
						return null
					}
					return data.token
				}
			])
		})
	}

	async validate(payload: any) {
		if (payload === null) {
			throw new UnauthorizedException()
		}
		return payload
	}
}
