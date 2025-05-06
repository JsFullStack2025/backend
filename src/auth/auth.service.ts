
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
  ) { }

  private async getPasswordHash(password: string): Promise<string> {
    return await argon2.hash(password);
  }

  private async checkPasswordHash(password: string, hash: string) {
    return await argon2.verify(hash, password);
  }

  public async validateUserCredentials(
    email: string,
    password: string,
  ): Promise<JwtPayload | null> {
    let user = await this.usersService.findOne(email);

    console.log(email)

    if (user == null) {
      //console.log(email)
      return null;
    }
    console.log(user)

    const isValidPassword = await this.checkPasswordHash(password, user.password);
    if (!isValidPassword) {
      return null;
    }

    let currentUser = new JwtPayload();
    currentUser.id = user.id;
    currentUser.username = user.username;
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
    const userDataToUpdate: UpdateUserTokenDto = {
      id: userId,
      refreshToken: randomToken.generate(16),
      refreshTokenExp: moment().day(1).toDate(),
    };

    await this.usersService.updateUserRefreshToken(userDataToUpdate);
    return userDataToUpdate.refreshToken;
  }

  public async validRefreshToken(
    email: string,
    refreshToken: string,
  ): Promise<JwtPayload | null> {
    const currentDate = moment().day(1).toDate();
    let user = await this.usersService.findAny({
      where: {
        email: email,
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

  public async validateUser(profile: any): Promise<JwtPayload | null> {
    let user = await this.usersService.findOne(profile.email);

    console.log("finding user", profile)



    if (!user) {
      console.log("no user")
      return null
    }
    else {
      //console.log(user)
      let currentUser = new JwtPayload();
      currentUser.id = user.id;
      currentUser.username = user.username;
      currentUser.isAdmin = user.isAdmin;
      console.log("currentUser",currentUser)
      return currentUser;
    }
  }

}