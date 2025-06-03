
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt.payload';

import * as randomToken from 'rand-token';
import * as moment from 'moment';
import { UpdateUserDto, UpdateUserTokenDto } from '@/Entities/Users.dto';
import { use } from 'passport';
import { Users } from '@prisma/client';

@Injectable()
export class AuthService {

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
      ) {}

  public async validateUserCredentials(
    email: string,
    password: string,
  ): Promise<JwtPayload | null> {
    console.log(email)
    let user = await this.usersService.findOne(email);
    console.log(user);
    if (user == null) {
      return null;
    }

    const isValidPassword = await checkPasswordHash(password, user.password);
    if (!isValidPassword) {
      return null;
    }

    let currentUser = new JwtPayload();
    currentUser.id = user.id;
    currentUser.username =  user.username;
    currentUser.isAdmin = user.isAdmin;
    return currentUser;
  }

  public async getJwtToken(user: JwtPayload): Promise<string> {
    const payload = {
      ...user,
    };
    return this.jwtService.signAsync(payload);
  }

  public async getRefreshToken(userId: number): Promise<string> {
    const userDataToUpdate:UpdateUserTokenDto = {
        id: userId,
        refreshToken: randomToken.generate(16),
        refreshTokenExp: moment().day(1).toDate(),
    };

    await this.usersService.updateUserRefreshToken(userDataToUpdate);
    return userDataToUpdate.refreshToken;
  }

  public async validRefreshToken(
    useremail: string,
    refreshToken: string,
  ): Promise<JwtPayload | null> {
    const currentDate = moment().day(1).toDate();
    let user = await this.usersService.findAny({
      where: {
        email: useremail,
        refreshToken: refreshToken,
        refreshTokenExp: {
            gte: currentDate
          },
      },
    });

    if (!user) {
      return null;
    }

    let currentUser = new JwtPayload();
    currentUser.id = user.id;
    currentUser.username = user.username;
    currentUser.isAdmin = user.isAdmin;
    return currentUser;
  }
  public async getUserToken(user:Users, res:any):Promise<Users| null | undefined> {
     const token = await this.getJwtToken(user as JwtPayload);
          const refreshToken = await this.getRefreshToken(user.id);
          const secretData = {
            userId: user.id,
            userName:user.username,
            token,
            refreshToken,
          };
          res.cookie('auth-cookie', secretData, {
            //httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Только для production
            sameSite: process.env.NODE_ENV === 'strict', //'production' ? 'strict' : 'lax',
            maxAge: 60000*30,
          });

          return this.usersService.findOne(user.username)
  }
}