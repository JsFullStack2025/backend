import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CardTypes } from '@prisma/client'
import { CreateCardTypeDto, UpdateCardDesignDto } from '@/Entities/CardDesign.dto';

@Injectable()
export class CardTypesService {
  constructor(private prisma: PrismaService) {}

  async cardsTypes(): Promise<CardTypes[] | null> {
    return this.prisma.cardTypes.findMany()
  }

  async createCardDType(carddata: CreateCardTypeDto): Promise<CardTypes> {
    return this.prisma.cardTypes.create({
      data: carddata
    });
  }

async cardTypeById(userid:number): Promise<CardTypes | null> {
      return this.prisma.cardTypes.findUnique({
        where: {id:userid},
      });
    }

  async updateCardType(carddata: UpdateCardDesignDto): Promise<CardTypes> {
    return this.prisma.cardTypes.update({
      where: { id:carddata.id },
      data: carddata
    });
  }

  async deleteCardType(cardid: number): Promise<CardTypes> {
    return this.prisma.cardTypes.delete({
      where: { id: cardid }
    });
  }
}