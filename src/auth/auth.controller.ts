import {
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Post,
    Req,
    Res,
    UseGuards,
  } from '@nestjs/common';

import { response, Response } from 'express';
import { JwtPayload } from './jwt.payload';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local.guard';
import { JwtAuthGuard } from './jwt.guard';
import { RefreshAuthGuard } from './refresh.guard';
import { CreateUsersDto } from '@/Entities/Users.dto';
import { UsersService} from  '@/users/users.service'


  @Controller('auth')
  export class AuthController {
    constructor(private authService: AuthService, private usersService: UsersService) {}

    @Post('registration')
   async registerUser(@Body() req:CreateUsersDto, @Res({ passthrough: true }) res: Response) {
      console.log(req.username)
      const user = await this.usersService.findOne(req.username)
      if(user){
        //throw 'User already exists';
       // return {error:true, massage:`Пользователь с Login=${req.username} уже зарегистрирован`};
       throw new HttpException(`Пользователь с email=${user.email} уже зарегистрирован`, HttpStatus.CONFLICT);
      }
      let newUser = await this.usersService.createUser(req);

      return await this.authService.getUserToken(newUser, res)
    }

    @Post('login')
    @UseGuards(LocalAuthGuard)
    async login(@Req() req, @Res({ passthrough: true }) res: Response) {
      console.log(req.user)
       return await this.authService.getUserToken(req.user, res)
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    async logout()
    {
      response.clearCookie('auth-cookie');
      return {}
    }

    @Get('testjwt')
    @UseGuards(JwtAuthGuard)
    async testjwt(@Req() req) {
      return {Work: 'Ok', user: req.user};
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
      return   {msg:'success'};
    }
  }


