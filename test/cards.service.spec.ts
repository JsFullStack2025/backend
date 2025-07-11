import { Test, TestingModule } from "@nestjs/testing"

import { CreateCardDto, UpdateCardDto } from "../src/Entities/Cards.dto"
import { AppController } from "../src/app.controller"
import { AppService } from "../src/app.service"
import { JwtAuthGuard } from "../src/auth/jwt.guard"
import { AdminGuard, UserGuard } from "../src/auth/roles.guard"
import { CardTypesService } from "../src/services/cardTypes.service"
import { CardsService } from "../src/services/cards.service"
import { PrismaService } from "../src/services/prisma.service"
import { UsersService } from "../src/users/users.service"

describe("AppController", () => {
	let controller: AppController

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AppController],
			providers: [
				AppService,
				PrismaService,
				UsersService,
				CardsService,
				CardTypesService
			]
		})
			.overrideGuard(JwtAuthGuard)
			.useValue({ canActivate: jest.fn().mockReturnValue(true) })
			.overrideGuard(UserGuard)
			.useValue({ canActivate: jest.fn().mockReturnValue(true) })
			.overrideGuard(AdminGuard)
			.useValue({ canActivate: jest.fn().mockReturnValue(true) })
			.compile()

		controller = module.get<AppController>(AppController)
	})

	afterEach(() => {
		jest.clearAllMocks()
	})

	// TODO: Cards API tests
	describe("Cards API", () => {
		const existCardID: number = 2
		let testCardID: number = 0
		const cardData: CreateCardDto = {
			authorId: 1,
			title: "Test Card",
			sharedUrl: "http://example.com",
			cardData: "{}",
			//designPrototypeId: 0,
			shared: true
		}

		describe("get Cards", () => {
			it("should return all cards", async () => {
				const result = await controller.getCards()
				expect(result?.length).toBeGreaterThan(0)
			})
		})

		describe("get Card By Id", () => {
			it("should return a card by ID", async () => {
				const result = await controller.getCardById(existCardID)
				expect(result?.id).toEqual(existCardID)
			})
		})

		describe("create Card", () => {
			it("should create a new card", async () => {
				const result = await controller.createCard(cardData)
				testCardID = result.id
				expect(result.id).toBeDefined()
				expect(result.authorId).toEqual(cardData.authorId)
				expect(result.title).toEqual(cardData.title)
			})
		})

		describe("patch Card", () => {
			it("should update a card", async () => {
				const updateData: UpdateCardDto = {
					id: testCardID,
					...cardData
				}
				updateData.title = "Updated Title"
				const result = await controller.patchCard(updateData)
				expect(result.title).toEqual("Updated Title")
			})
		})

		describe("remove Card", () => {
			it("should delete a card", async () => {
				expect(testCardID).toBeGreaterThan(0)
				const result = await controller.removeCard(testCardID)
				expect(result.id).toEqual(testCardID)
			})
		})
	})
})
