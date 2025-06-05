import { Injectable } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"

@Injectable()
export class OptionalJwtStrategy extends PassportStrategy(
	Strategy,
	"optional-jwt"
) {
	constructor() {
		super({
			ignoreExpiration: false,
			secretOrKey: process.env.JWT_SECRET!,
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
		})
	}

	async validate(payload: any) {
		return payload || null
	}
}
