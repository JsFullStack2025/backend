import { Injectable } from "@nestjs/common"
import { Cards } from "@prisma/client"

import { CreateCardDto, UpdateCardDto } from "@/Entities/Cards.dto"
import { CreateCardRequestDto } from "@/cards/dto/create-card-request.dto"
import { UpdateCardRequestDto } from "@/cards/dto/update-card-request.dto"

import { PrismaService } from "./prisma.service"

@Injectable()
export class CardsService {
	constructor(private prisma: PrismaService) {}

	async cards(): Promise<Cards[] | null> {
		return this.prisma.cards.findMany()
	}

	async cardsByUserId(userId: number): Promise<Cards[] | null> {
		return this.prisma.cards.findMany({
			where: {
				authorId: userId
			}
		})
	}

	async createCard(carddata: CreateCardDto): Promise<Cards> {
		return this.prisma.cards.create({
			data: carddata
		})
	}

	async createUserCard(
		userId: number,
		carddata: CreateCardRequestDto
	): Promise<Cards> {
		return this.prisma.cards.create({
			data: {
				title: carddata.name,
				authorId: userId
			}
		})
	}

	async cardById(id: number) {
		return this.prisma.cards.findUnique({
			where: { id }
		})
	}

	async updateCard(carddata: UpdateCardDto): Promise<Cards> {
		return this.prisma.cards.update({
			data: carddata,
			where: { id: carddata.id }
		})
	}

	async updateCardById(
		cardId: number,
		data: UpdateCardRequestDto
	): Promise<Cards> {
		return this.prisma.cards.update({
			where: { id: cardId },
			data: {
				title: data.name,
				cardData: data.content,
				shared: data.isPublic
			}
		})
	}

	async deleteCard(cardid: number): Promise<Cards> {
		return this.prisma.cards.delete({
			where: { id: cardid }
		})
	}
}
