import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { response, Response } from 'express';
import { JwtPayload } from './jwt.payload';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local.guard';
import { JwtAuthGuard } from './jwt.guard';
import { RefreshAuthGuard } from './refresh.guard';
import { CreateUsersDto } from '@/Entities/Users.dto';
import { UsersService } from '@/users/users.service'
import { Recaptcha } from "@nestlab/google-recaptcha"
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private userService: UsersService) { }
   private readonly configService: ConfigService


  @Recaptcha()
  @Post('registration')
  async registerUser(@Body() reg: CreateUsersDto) {
    const user = await this.userService.findOne(reg.email)
    if (user) {
      throw 'User already exists';
    }
    return await this.userService.createUser(reg);
  }

  //@Recaptcha()
  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Req() req, @Body() body, @Res({ passthrough: true }) res: Response) {
    console.log(req.user);
    const token = await this.authService.getJwtToken(req.user as JwtPayload);
    const refreshToken = await this.authService.getRefreshToken(req.user.id);
    const secretData = {
      userId: req.user.id,
      email: req.user.email,
      token,
      refreshToken,
    };
    res.cookie('auth-cookie', secretData, {
      //httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Только для production
      sameSite: process.env.NODE_ENV === 'strict', //'production' ? 'strict' : 'lax',
      maxAge: 60000 * 30,
    });
    return { msg: 'success', user: req.user };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout() {
    response.clearCookie('auth-cookie');
    return {}
  }

  @Get('testjwt')
  @UseGuards(JwtAuthGuard)
  async testjwt(@Req() req) {
    return { Work: 'Ok', user: req.user };
  }

  @Get('refresh-tokens')
  @UseGuards(RefreshAuthGuard)
  async regenerateTokens(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.getJwtToken(req.user as JwtPayload);
    const refreshToken = await this.authService.getRefreshToken(
      req.user.id,
    );
    const secretData = {
      token,
      refreshToken,
    };

    res.cookie('auth-cookie', secretData, { httpOnly: true });
    return { msg: 'success' };
  }
}