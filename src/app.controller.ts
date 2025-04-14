import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, NotFoundException, UseGuards, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { UsersService } from './users/users.service'
import { Cards, CardTypes, Users } from '@prisma/client';
import { CardsService } from './services/cards.service';
import { CardTypesService } from "./services/cardTypes.service";
import { CreateUsersDto, UpdateUserDto } from './Entities/Users.dto';
import { CreateCardDto, UpdateCardDto } from './Entities/Cards.dto';
import { IResponseResult } from './Entities/IResponseResult';
import { ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from './auth/jwt.guard';
import { UserGuard, AdminGuard } from './auth/roles.guard';
import { CreateCardTypeDto, UpdateCardTypeDto } from './Entities/CardDesign.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly userService: UsersService,
    private readonly cardsService: CardsService,
    private readonly cardTypesService: CardTypesService
  ) {}

  @ApiOkResponse({ type: IResponseResult<string>, description: 'Test method' })
  @Get()
  @UseGuards(JwtAuthGuard)
  getHello(): IResponseResult<string> {
    const result: IResponseResult<string>  = { success : true, value: this.appService.getHello()};
    return result;
  }

// TODO: USERS API
  @Get('user')
  @ApiOkResponse({ type: Promise<Users[]>, description: 'Get all users' })
  async getUsers() : Promise<Users[]> {
    return this.userService.users();
  }

  @Get('user:id')
  @UseGuards(JwtAuthGuard, UserGuard)
  @ApiOkResponse({ type: Promise<Users>, description: 'Get user by ID' })
  @ApiOkResponse({type: Promise<Users | null>})
  async getUserById(@Param('id',ParseIntPipe) id: number) : Promise<Users | null> {
    const result = await this.userService.userById(id);
    if(!result) throw new NotFoundException(`User с Id=${id} не найден`);
    return result;
  }

  @Post('user')
  @ApiOkResponse({ type: Promise<Users>, description: 'Create user' })
  async createUser(
    @Body() userData: CreateUsersDto
  ): Promise<Users> {
    return this.userService.createUser(userData);
  }

  @Patch('user')
  @UseGuards(JwtAuthGuard, UserGuard)
  @ApiOkResponse({ type: Promise<Users>, description: 'Update user' })
  async patchUser (
    @Body() userData : UpdateUserDto
  ) : Promise<Users> {
    const user = await this.userService.userById(userData.id);
    if(!user) throw new NotFoundException(`User с Id=${userData.id} не найден`);
    const result = await this.userService.updateUser(userData);
    return result;
  }

  @Delete('user:id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOkResponse({ type: Promise<Users[]>, description: 'Delete user' })
  @ApiNotFoundResponse({ })
  async removeUser(@Param('id',ParseIntPipe) id: number) {
    const user = await this.userService.userById(id);
    if(!user) throw new NotFoundException(`User с Id=${id} не найден`);
    const result = this.userService.deleteUser(id);
    return result;
  }

  // TODO: CARDS API
  @Get('cards')
  @ApiOkResponse({ type: Promise<Cards[]>, description: 'Get all cards' })
  async getCards(): Promise<Cards[] | null> {
    return this.cardsService.cards();
  }

  @Get('cards:id')
  @ApiOkResponse({ type: Promise<Cards | null>, description: 'Get card by ID' })
  async getCardById(@Param('id',ParseIntPipe) id: number) : Promise<Cards | null> {
    const result = await this.cardsService.cardById(id);
    if(!result) throw new NotFoundException(`Card с Id=${id} не найдена`);
    return result;
  }

  @Post('cards')
  @ApiOkResponse({ type: Promise<Cards>, description: 'Create card' })
  async createCard(
    @Body() cardData: CreateCardDto
  ) : Promise<Cards> {
    return this.cardsService.createCard(cardData);
  }

  @Patch('cards')
  @ApiOkResponse({ type: Promise<Cards>, description: 'Update card' })
  async patchCard (
  @Body() cardData : UpdateCardDto
  ) : Promise<Cards> {
    const card = await this.cardsService.cardById(cardData.id);
    if(!card) throw new NotFoundException(`Card с Id=${cardData.id} не найден`);
    const result = this.cardsService.updateCard(cardData);
    return result;
  }

  @Delete('cards:id')
  @ApiOkResponse({ type: Promise<Cards>, description: 'Delete card' })
  async removeCard(@Param('id',ParseIntPipe) id: number) {
    const card = await this.cardsService.cardById(id);
    if(!card) throw new NotFoundException(`Card с Id=${id} не найден`);
    const result = this.cardsService.deleteCard(id);
    return result;
  }

  // TODO: CARDTYPES API
  @Get('cardtypes')
  @ApiOkResponse({ type: Promise<CardTypes[]>, description: 'Get all card types' })
  async getCardTypes(): Promise<CardTypes[] | null> {
    return this.cardTypesService.cardsTypes();
  }

  @Get('cardtypes:id')
  @ApiOkResponse({ type: Promise<CardTypes | null>, description: 'Get cardtypes by ID' })
  async getCardTypesById(@Param('id',ParseIntPipe) id: number) : Promise<CardTypes | null> {
    const result = await this.cardTypesService.cardTypeById(id);
    if(!result) throw new NotFoundException(`Card с Id=${id} не найдена`);
    return result;
  }

  @Post('cardtypes')
  @ApiOkResponse({ type: Promise<CardTypes>, description: 'Create card' })
  async createCardType(
    @Body() cardData: CreateCardTypeDto
  ) : Promise<CardTypes> {
    return this.cardTypesService.createCardDType(cardData);
  }

  @Patch('cardtypes')
  @ApiOkResponse({ type: Promise<CardTypes>, description: 'Update card type' })
  async patchCardType (
  @Body() cardData : UpdateCardTypeDto
  ) : Promise<CardTypes> {
    const card = await this.cardsService.cardById(cardData.id);
    if(!card) throw new NotFoundException(`Card с Id=${cardData.id} не найден`);
    const result = this.cardTypesService.updateCardType(cardData);
    return result;
  }

  @Delete('cardtypes:id')
  @ApiOkResponse({ type: Promise<CardTypes>, description: 'Delete card' })
  async removeCardtype(@Param('id',ParseIntPipe) id: number) {
    const card = await this.cardTypesService.cardTypeById(id);
    if(!card) throw new NotFoundException(`Card type с Id=${id} не найден`);
    const result = this.cardTypesService.deleteCardType(id);
    return result;
  }
}
