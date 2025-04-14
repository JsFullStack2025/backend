import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CardTypes } from '@prisma/client'
import { CreateCardTypeDto } from '@/Entities/CardDesign.dto';

@Injectable()
export class CardsTypesService {
  constructor(private prisma: PrismaService) {}

  async cardsTypes(): Promise<CardTypes[] | null> {
    return this.prisma.cardTypes.findMany()
  }

  async createCardDType(carddata: CreateCardTypeDto): Promise<CardTypes> {
    return this.prisma.cardTypes.create({
      data: carddata
    });
  }


}