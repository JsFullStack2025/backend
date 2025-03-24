
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { RefreshStrategy } from './refresh.strategy';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    UsersModule,
    JwtModule.register({
              global: true,
              secret: process.env.JWT_SECRET!,
              signOptions: { expiresIn: process.env.JWT_EXPIRES },
            }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ],
  providers: [AuthService, LocalStrategy, JwtStrategy, RefreshStrategy],
})
export class AuthModule {}