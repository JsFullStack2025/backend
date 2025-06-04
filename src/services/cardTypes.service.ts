import { Injectable } from "@nestjs/common"
import { CardTypes } from "@prisma/client"

import { CreateCardTypeDto, UpdateCardTypeDto } from "@/Entities/CardDesign.dto"

import { PrismaService } from "./prisma.service"

@Injectable()
export class CardTypesService {
	constructor(private prisma: PrismaService) {}

	async cardsTypes(): Promise<CardTypes[] | null> {
		return this.prisma.cardTypes.findMany()
	}

	async createCardDType(carddata: CreateCardTypeDto): Promise<CardTypes> {
		return this.prisma.cardTypes.create({
			data: carddata
		})
	}

	async cardTypeById(userid: number): Promise<CardTypes | null> {
		return this.prisma.cardTypes.findUnique({
			where: { id: userid }
		})
	}

	async updateCardType(carddata: UpdateCardTypeDto): Promise<CardTypes> {
		return this.prisma.cardTypes.update({
			where: { id: carddata.id },
			data: carddata
		})
	}

	async deleteCardType(cardid: number): Promise<CardTypes> {
		return this.prisma.cardTypes.delete({
			where: { id: cardid }
		})
	}
}
