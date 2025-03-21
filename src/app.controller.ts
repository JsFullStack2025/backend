import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { UsersService } from './services/users.service'
import { Cards, Prisma, Users } from '@prisma/client';
import { CardsService } from './services/cards.service';
import { CreateUsersDto, UpdateUserDto } from './Entities/Users.dto';
import { CreateCardDto, UpdateCardDto } from './Entities/Cards.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly userService: UsersService,
    private readonly cardsService: CardsService
  ) {}

  // @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }

  @Get('user')
  async getUsers() : Promise<Users[]> {
    return this.userService.users();
  }

  @Post('user')
  async createUser(
    @Body() userData: CreateUsersDto
  ): Promise<Users> {
    return this.userService.createUser(userData);
  }

  @Patch('user')
  async patchUser (
    @Body() userData : UpdateUserDto
  ) : Promise<Users> {
    return this.userService.updateUser(userData);
  }

  @Get('cards')
  async getCards(): Promise<Cards[] | null> {
    return this.cardsService.cards();
  }

  @Post('cards')
  async createCard(
    @Body() cardData: CreateCardDto
  ) : Promise<Cards> {
    return this.cardsService.createCard(cardData);
  }

  @Patch('cards')
  async patchCard (
  @Body() cardData : UpdateCardDto
  ) : Promise<Cards> {
    return this.cardsService.updateCard(cardData);
  }
}
