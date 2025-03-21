import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Users, Prisma, Cards } from '@prisma/client';
import { CreateCardDto, UpdateCardDto } from '@/Entities/Cards.dto';

@Injectable()
export class CardsService {
  constructor(private prisma: PrismaService) {}

  async cards(): Promise<Cards[] | null> {
    return this.prisma.cards.findMany()
  }

  async createCard(carddata: CreateCardDto): Promise<Cards> {
    return this.prisma.cards.create({
      data: carddata
    });
  }

  async updateCard(carddata: UpdateCardDto): Promise<Cards> {
    return this.prisma.cards.update({
      data: carddata,
      where: {id:carddata.id}
    });
  }
  async deleteCard(cardid: number): Promise<Cards> {
    return this.prisma.cards.delete({
      where: { id: cardid }
    });
  }
}