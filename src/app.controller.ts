import {
	Body,
	Controller,
	Delete,
	Get,
	HttpException,
	HttpStatus,
	NotFoundException,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Req,
	UnauthorizedException,
	UseGuards
} from "@nestjs/common"
import { ApiNotFoundResponse, ApiOkResponse } from "@nestjs/swagger"
import { CardTypes, Cards, Users } from "@prisma/client"

import { CreateCardTypeDto, UpdateCardTypeDto } from "./Entities/CardDesign.dto"
import { CreateCardDto, UpdateCardDto } from "./Entities/Cards.dto"
import { IResponseResult } from "./Entities/IResponseResult"
import { UpdateUserDto } from "./Entities/Users.dto"
import { AppService } from "./app.service"
import { RegisterRequestDto } from "./auth/dto/register-request.dto"
import { JwtAuthGuard } from "./auth/jwt.guard"
import { OptionalJwtAuthGuard } from "./auth/optional-jwt.guard"
import { UserGuard } from "./auth/roles.guard"
import { CreateCardRequestDto } from "./cards/dto/create-card-request.dto"
import { UpdateCardRequestDto } from "./cards/dto/update-card-request.dto"
import { CardTypesService } from "./services/cardTypes.service"
import { CardsService } from "./services/cards.service"
import { UpdateUserRequestDto } from "./users/dto/update-user-request.dto"
import { UsersService } from "./users/users.service"

@Controller()
export class AppController {
	constructor(
		private readonly appService: AppService,
		private readonly userService: UsersService,
		private readonly cardsService: CardsService,
		private readonly cardTypesService: CardTypesService
	) {}

	@ApiOkResponse({
		type: IResponseResult<string>,
		description: "Test method"
	})
	@Get()
	//@UseGuards(JwtAuthGuard)
	getHello(): IResponseResult<string> {
		const result: IResponseResult<string> = {
			success: true,
			value: this.appService.getHello()
		}
		return result
	}

	// TODO: USERS API
	@Get("user")
	@ApiOkResponse({ type: Promise<Users[]>, description: "Get all users" })
	async getUsers(): Promise<Users[]> {
		return this.userService.users()
	}

	@Get("user/current")
	@UseGuards(JwtAuthGuard)
	@ApiOkResponse({ type: Promise<Users>, description: "Get current user" })
	async getCurrentUser(@Req() req) {
		return await this.userService.findByEmail(req.user.email)
	}

	@Patch("user/current")
	@UseGuards(JwtAuthGuard)
	@ApiOkResponse({ type: Promise<Users>, description: "Update current user" })
	async updateCurrentUser(@Req() req, @Body() data: UpdateUserRequestDto) {
		return this.userService.updateUser({
			id: req.user.userId,
			username: data.username
		})
	}

	@Get("user:id")
	@UseGuards(JwtAuthGuard, UserGuard)
	@ApiOkResponse({ type: Promise<Users>, description: "Get user by ID" })
	@ApiOkResponse({ type: Promise<Users | null> })
	async getUserById(
		@Param("id", ParseIntPipe) id: number
	): Promise<Users | null> {
		const result = await this.userService.userById(id)
		//if(!result) throw new NotFoundException(`User с Id=${id} не найден`);
		return result
	}

	@Post("user")
	@ApiOkResponse({ type: Promise<Users>, description: "Create user" })
	async createUser(@Body() userData: RegisterRequestDto): Promise<Users> {
		return this.userService.createUser(userData)
	}

	@Patch("user")
	@UseGuards(JwtAuthGuard, UserGuard)
	@ApiOkResponse({ type: Promise<Users>, description: "Update user" })
	async patchUser(@Body() userData: UpdateUserDto): Promise<Users> {
		//if(request.user.id!==userData.id) return "Не твоя карточка";

		const user = await this.userService.userById(userData.id)
		if (!user)
			throw new NotFoundException(`User с Id=${userData.id} не найден`)
		if (userData.email && user.email !== userData.email) {
			if (await this.userService.checkUniqueEmail(userData.email))
				throw new HttpException(
					`Пользователь с email=${userData.email} уже зарегистрирован`,
					HttpStatus.CONFLICT
				)
		}
		const result = await this.userService.updateUser(userData)
		return result
	}

	@Delete("user:id")
	@UseGuards(JwtAuthGuard) //, AdminGuard)
	@ApiOkResponse({ type: Promise<Users[]>, description: "Delete user" })
	@ApiNotFoundResponse({})
	async removeUser(@Param("id", ParseIntPipe) id: number) {
		const user = await this.userService.userById(id)
		if (!user) throw new NotFoundException(`User с Id=${id} не найден`)
		const result = this.userService.deleteUser(id)
		return result
	}
	@Get("user:id/cards")
	@UseGuards(JwtAuthGuard) //, UserGuard)
	@ApiOkResponse({ type: Promise<Users>, description: "Get user cards" })
	@ApiOkResponse({ type: Promise<Users | null> })
	async getUserCards(
		@Param("id", ParseIntPipe) idUser: number
	): Promise<Cards[] | null> {
		const result = await this.userService.getUserCards(idUser)
		if (!result)
			throw new NotFoundException(`No cards for User Id=${idUser}`)
		return result
	}

	@Get("cards")
	@UseGuards(JwtAuthGuard)
	@ApiOkResponse({
		type: Promise<Cards[]>,
		description: "Get current user cards"
	})
	async getCurrentUserCards(@Req() req) {
		return (await this.cardsService.cardsByUserId(req.user.userId))?.map(
			(card) => ({
				id: card.id,
				name: card.title,
				isPublic: card.shared,
				createdAt: new Date().toISOString()
			})
		)
	}

	@Post("cards")
	@UseGuards(JwtAuthGuard)
	@ApiOkResponse({ type: Promise<Cards>, description: "Create card" })
	async createCardByUser(@Req() req, @Body() cardData: CreateCardRequestDto) {
		const card = await this.cardsService.createUserCard(
			req.user.userId,
			cardData
		)
		return {
			id: card.id,
			name: card.title,
			content: card.cardData,
			userId: card.authorId,
			isPublic: card.shared,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString()
		}
	}

	@Patch("cards/:id")
	@UseGuards(JwtAuthGuard)
	@ApiOkResponse({ type: Promise<Cards>, description: "Update card" })
	async updateUserCard(
		@Req() req,
		@Param("id", ParseIntPipe) id: number,
		@Body() data: UpdateCardRequestDto
	) {
		const card = await this.cardsService.cardById(id)
		if (!card) throw new NotFoundException(`Card с Id=${id} не найден`)

		if (card.authorId !== req.user.userId)
			throw new UnauthorizedException(
				"You are not the owner of this card"
			)

		const result = await this.cardsService.updateCardById(id, data)
		return {
			id: result.id,
			name: result.title,
			content: result.cardData,
			isPublic: result.shared
		}
	}

	@Get("cards/:id")
	@UseGuards(OptionalJwtAuthGuard)
	@ApiOkResponse({ type: Promise<Cards>, description: "Update card" })
	async getCardById(@Req() req, @Param("id", ParseIntPipe) id: number) {
		const card = await this.cardsService.cardById(id)
		if (!card) throw new NotFoundException(`Card с Id=${id} не найден`)

		if (!card.shared && req.user && card.authorId !== req.user.userId) {
			throw new UnauthorizedException(
				"You are not the owner of this card"
			)
		}

		return {
			id: card.id,
			name: card.title,
			content: card.cardData,
			isPublic: card.shared
		}
	}

	@Delete("cards/:id")
	@UseGuards(JwtAuthGuard)
	@ApiOkResponse({ type: Promise<Cards>, description: "Delete card" })
	async deleteCardById(@Req() req, @Param("id", ParseIntPipe) id: number) {
		const card = await this.cardsService.cardById(id)
		if (!card) throw new NotFoundException(`Card с Id=${id} не найден`)

		if (card.authorId !== req.user.userId) {
			throw new UnauthorizedException(
				"You are not the owner of this card"
			)
		}

		await this.cardsService.deleteCard(id)
		return {
			id: card.id,
			name: card.title,
			content: card.cardData,
			isPublic: card.shared
		}
	}

	@Post("createCard")
	@ApiOkResponse({ type: Promise<Cards>, description: "Create card" })
	async createCard(@Body() cardData: CreateCardDto): Promise<Cards> {
		return this.cardsService.createCard(cardData)
	}

	@Patch("updateCard")
	@ApiOkResponse({ type: Promise<Cards>, description: "Update card" })
	async patchCard(@Body() cardData: UpdateCardDto): Promise<Cards> {
		const card = await this.cardsService.cardById(cardData.id)
		if (!card)
			throw new NotFoundException(`Card с Id=${cardData.id} не найден`)
		const result = this.cardsService.updateCard(cardData)
		return result
	}

	@Delete("deleteCard:id")
	@ApiOkResponse({ type: Promise<Cards>, description: "Delete card" })
	async removeCard(@Param("id", ParseIntPipe) id: number) {
		const card = await this.cardsService.cardById(id)
		if (!card) throw new NotFoundException(`Card с Id=${id} не найден`)
		const result = this.cardsService.deleteCard(id)
		return result
	}

	// TODO: CARDTYPES API
	@Get("cardtypes")
	@ApiOkResponse({
		type: Promise<CardTypes[]>,
		description: "Get all card types"
	})
	async getCardTypes(): Promise<CardTypes[] | null> {
		return this.cardTypesService.cardsTypes()
	}

	@Get("cardtypes:id")
	@ApiOkResponse({
		type: Promise<CardTypes | null>,
		description: "Get cardtypes by ID"
	})
	async getCardTypesById(
		@Param("id", ParseIntPipe) id: number
	): Promise<CardTypes | null> {
		const result = await this.cardTypesService.cardTypeById(id)
		if (!result) throw new NotFoundException(`Card с Id=${id} не найдена`)
		return result
	}

	@Post("cardtypes")
	@ApiOkResponse({ type: Promise<CardTypes>, description: "Create card" })
	async createCardType(
		@Body() cardData: CreateCardTypeDto
	): Promise<CardTypes> {
		return this.cardTypesService.createCardDType(cardData)
	}

	@Patch("cardtypes")
	@ApiOkResponse({
		type: Promise<CardTypes>,
		description: "Update card type"
	})
	async patchCardType(
		@Body() cardData: UpdateCardTypeDto
	): Promise<CardTypes> {
		const card = await this.cardTypesService.cardTypeById(cardData.id)
		if (!card)
			throw new NotFoundException(
				`Card type с Id=${cardData.id} не найден`
			)
		return this.cardTypesService.updateCardType(cardData)
	}

	@Delete("cardtypes:id")
	@ApiOkResponse({
		type: Promise<CardTypes>,
		description: "Delete card type"
	})
	async removeCardtype(@Param("id", ParseIntPipe) id: number) {
		const card = await this.cardTypesService.cardTypeById(id)
		if (!card) throw new NotFoundException(`Card type с Id=${id} не найден`)
		if (card.readonly)
			throw new NotFoundException(
				`Card type с Id=${id} только для чтения, удалять нельзя`
			)
		return this.cardTypesService.deleteCardType(id)
	}
}
