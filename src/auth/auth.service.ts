
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt.payload';

import * as randomToken from 'rand-token';
import * as moment from 'moment';
import { UpdateUserDto, UpdateUserTokenDto } from '@/Entities/Users.dto';
import { use } from 'passport';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
      ) {}

  private async getPasswordHash(password: string): Promise<string> {
    return await argon2.hash(password);
  }

  private async checkPasswordHash(password: string, hash:string) {
    return await argon2.verify(hash, password);
  }

  public async validateUserCredentials(
    username: string,
    password: string,
  ): Promise<JwtPayload | null> {
    let user = await this.usersService.findOne(username);

    if (user == null) {
      return null;
    }

    const isValidPassword = await this.checkPasswordHash(password, user.password);
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

    await this.usersService.updateUserToken(userDataToUpdate);
    return userDataToUpdate.refreshToken;
  }

  public async validRefreshToken(
    username: string,
    refreshToken: string,
  ): Promise<JwtPayload | null> {
    const currentDate = moment().day(1).toDate();
    let user = await this.usersService.findAny({
      where: {
        username: username,
        refreshToken: refreshToken,
        refreshTokenExp: {
            gte: currentDate // TODO: проверить! или gte: new Date()
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
}