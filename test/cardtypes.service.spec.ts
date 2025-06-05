import { NotFoundException } from "@nestjs/common"
import { Test, TestingModule } from "@nestjs/testing"

import { CreateCardTypeDto } from "@/Entities/CardDesign.dto"

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

	// TODO: CardTypes API tests
	describe("CardTypes API", () => {
		let testCardTypeID: number = 0
		const cardTypeData: CreateCardTypeDto = {
			title: "Test Card Type",
			description: "Test Description"
		}

		describe("get Card Types", () => {
			it("should return all card types", async () => {
				const result = await controller.getCardTypes()
				expect(result?.length).toBeGreaterThan(0)
			})
		})

		describe("get CardTypes By Id", () => {
			it("should return a card type by ID", async () => {
				const result = await controller.getCardTypesById(1)
				expect(result?.id).toEqual(1)
			})

			it("should throw NotFoundException if card type not found", async () => {
				await expect(controller.getCardTypesById(0)).rejects.toThrow(
					NotFoundException
				)
			})
		})

		describe("createCardType", () => {
			it("should create a new card type", async () => {
				const result = await controller.createCardType(cardTypeData)
				testCardTypeID = result.id
				expect(result.title).toEqual(cardTypeData.title)
				expect(result.description).toEqual(cardTypeData.description)
			})
		})

		describe("patch Card Type", () => {
			it("should update a card type", async () => {
				const updateData = { id: testCardTypeID, ...cardTypeData }
				updateData.title = "Updated Title"
				const result = await controller.patchCardType(updateData)
				expect(result.title).toEqual(updateData.title)
			})

			it("should throw NotFoundException if card type not found", async () => {
				const updateData = {
					id: 0,
					title: "Platinum Plus",
					description: "Updated Description"
				}
				await expect(
					controller.patchCardType(updateData)
				).rejects.toThrow(NotFoundException)
			})
		})

		describe("remove Cardtype", () => {
			it("should delete a card type", async () => {
				expect(testCardTypeID).toBeGreaterThan(0)
				const result = await controller.removeCardtype(testCardTypeID)
				expect(result.id).toEqual(testCardTypeID)
			})

			it("should throw NotFoundException if card type not found", async () => {
				await expect(controller.removeCardtype(0)).rejects.toThrow(
					NotFoundException
				)
			})

			it("should throw NotFoundException if card type is readonly", async () => {
				await expect(controller.removeCardtype(1)).rejects.toThrow(
					NotFoundException
				)
			})
		})
	})
})
