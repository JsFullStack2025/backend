import { Test, TestingModule } from "@nestjs/testing"

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
	let usersService: UsersService
	let cardsService: CardsService
	let cardTypesService: CardTypesService
	let appService: AppService
	let prismaService: PrismaService

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
		prismaService = module.get<PrismaService>(PrismaService)
		usersService = module.get<UsersService>(UsersService)
		cardsService = module.get<CardsService>(CardsService)
		cardTypesService = module.get<CardTypesService>(CardTypesService)
		appService = module.get<AppService>(AppService)
	})

	afterEach(() => {
		jest.clearAllMocks()
	})

	describe("Root endpoint", () => {
		it("should be defined", () => {
			expect(controller).toBeDefined()
		})
		it("should return from API true", () => {
			expect(controller.getHello().success).toBe(true)
		})
	})

	describe("PrismaService", () => {
		it("should be defined", () => {
			expect(prismaService).toBeDefined()
		})
	})

	describe("UsersService", () => {
		it("should be defined", () => {
			expect(usersService).toBeDefined()
		})
	})
	describe("CardsService", () => {
		it("should be defined", () => {
			expect(cardsService).toBeDefined()
		})
	})
	describe("CardTypesService", () => {
		it("should be defined", () => {
			expect(cardTypesService).toBeDefined()
		})
	})
	describe("AppService", () => {
		it("should be defined", () => {
			expect(appService).toBeDefined()
		})
	})
})
