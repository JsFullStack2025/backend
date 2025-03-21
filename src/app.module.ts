import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersService} from './services/users.service';
import { CardsService } from './services/cards.service';
import { PrismaService } from './services/prisma.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, PrismaService, UsersService, CardsService],
})
export class AppModule {}
