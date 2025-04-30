
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from "@nestjs/config"
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { GoogleRecaptchaModule } from "@nestlab/google-recaptcha"

import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { RefreshStrategy } from './refresh.strategy';
import { JwtModule } from '@nestjs/jwt';
import { getRecaptchaConfig } from "@/config/recaptcha.config"
@Module({
  imports: [
    UsersModule,
    JwtModule.register({
              global: true,
              secret: process.env.JWT_SECRET!,
              signOptions: { expiresIn: process.env.JWT_EXPIRES },
            }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    GoogleRecaptchaModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: getRecaptchaConfig,
			inject: [ConfigService]
		}),
    ],
  providers: [AuthService, LocalStrategy, JwtStrategy, RefreshStrategy],
})
export class AuthModule {}