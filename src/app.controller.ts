import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { UsersService } from './services/users.service'
import { Users } from '@prisma/client';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly userService: UsersService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('user')
  async getUsers() : Promise<Users[]> {
    return this.userService.users();
  }

  @Post('user')
  async signupUser(
    @Body() userData: {
      login: string;
      hash: string;
      email: string;
    },
  ): Promise<Users> {
    return this.userService.createUser(userData);
  }
}
