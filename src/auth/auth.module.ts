import { Module } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt"
import { PassportModule } from "@nestjs/passport"

import { UsersModule } from "../users/users.module"

import { AuthService } from "./auth.service"
import { JwtStrategy } from "./jwt.strategy"
import { LocalStrategy } from "./local.strategy"
import { RefreshStrategy } from "./refresh.strategy"

@Module({
	imports: [
		UsersModule,
		JwtModule.register({
			global: true,
			secret: process.env.JWT_SECRET!,
			signOptions: { expiresIn: process.env.JWT_EXPIRES }
		}),
		PassportModule.register({ defaultStrategy: "jwt" })
	],
	providers: [AuthService, LocalStrategy, JwtStrategy, RefreshStrategy]
})
export class AuthModule {}
