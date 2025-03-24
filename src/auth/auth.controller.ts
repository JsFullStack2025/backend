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
  import { Response } from 'express';
  import { CurrentUser } from './CurrentUser';
  //import { RegistrationReqModel } from 'src/models/registration.req.model';
  import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local.guard';
import { JwtAuthGuard } from './jwt.guard';
import { RefreshAuthGuard } from './refresh.guard';
  
  @Controller('auth')
  export class AuthController {
    constructor(private authService: AuthService) {}
  
    // @Post('registration')
    // async registerUser(@Body() reg: RegistrationReqModel) {
    //   return await this.authService.registerUser(reg);
    // }

    @Post('login')
    @UseGuards(LocalAuthGuard)
    async login(@Req() req, @Res({ passthrough: true }) res: Response) {
      //console.log(req);
      const token = await this.authService.getJwtToken(req.user as CurrentUser);
      const refreshToken = await this.authService.getRefreshToken(
        req.user.id,
      );
      const secretData = {
        token,
        refreshToken,
      };

      res.cookie('auth-cookie', secretData, { httpOnly: true });
      return  {msg:'success'};
    }
  
    @Get('testjwt')
    @UseGuards(JwtAuthGuard)
    async movies(@Req() req) {
      return ['Ok', 'Work'];
    }
  
    @Get('refresh-tokens')
    @UseGuards(RefreshAuthGuard)
    async regenerateTokens(
      @Req() req,
      @Res({ passthrough: true }) res: Response,
    ) {
      const token = await this.authService.getJwtToken(req.user as CurrentUser);
      const refreshToken = await this.authService.getRefreshToken(
        req.user.id,
      );
      const secretData = {
        token,
        refreshToken,
      };

      res.cookie('auth-cookie', secretData, { httpOnly: true });
      return   {msg:'success'};
    }
  }