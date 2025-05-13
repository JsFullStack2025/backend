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
import { Request, Response } from 'express';
import { JwtPayload } from './jwt.payload';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local.guard';
import { JwtAuthGuard } from './jwt.guard';
import { RefreshAuthGuard } from './refresh.guard';

import { Recaptcha } from "@nestlab/google-recaptcha"
import { GoogleGuard } from './ouath.guard';




@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  // @Post('registration')
  // async registerUser(@Body() reg: RegistrationReqModel) {
  //   return await this.authService.registerUser(reg);
  // }

  @Recaptcha()
  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Req() req, @Body() body, @Res({ passthrough: true }) res: Response) {
    const token = await this.authService.getJwtToken(req.user as JwtPayload);
    const refreshToken = await this.authService.getRefreshToken(req.user.id);
    const secretData = {
      token,
      refreshToken,
    };
    res.cookie('auth-cookie', secretData, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Только для production 
      sameSite: process.env.NODE_ENV === 'strict', //'production' ? 'strict' : 'lax',
      maxAge: 60000,
    });

    return { msg: 'success', user: req.user };
  }

  @Get('testjwt')
  @UseGuards(JwtAuthGuard)
  async movies(@Req() req) {
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

  @Get('google')
  @UseGuards(GoogleGuard)
  googleAuth() { }

  @Get('google/callback')
  @UseGuards(GoogleGuard)
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {

    if (res.statusCode === 200) {
      console.log("resOk");
      //console.log(res);
      const user = await this.authService.validateUser(res.req.user);

      if (user) {
        const token = await this.authService.getJwtToken(user as JwtPayload);
        const refreshToken = await this.authService.getRefreshToken(user.id);
        const secretData = {
          token,
          refreshToken,
        };
        res.cookie('auth-cookie', secretData, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production', // Только для production 
          sameSite: process.env.NODE_ENV === 'strict', //'production' ? 'strict' : 'lax',
          maxAge: 60000,
        });
        req.session.user = req.user as {
          email: string;
          name: string;
          photo?: string | undefined;
        };
      }
      res.redirect(process.env.CLIENT as string);
      console.log('redirect is working')
      return { msg: 'success', user: user };
    }
    else console.log("res.code", res.statusCode)
    res.redirect(process.env.CLIENT as string);
  }

  @Get('session')
  getSession(@Req() req: Request, @Res() res: Response) {
    if (req.session && req.session.user) {
      return res.json({ user: req.session.user });
    } else {
      return res.status(401).json({ message: 'Not authenticated' });
    }
  }

}



