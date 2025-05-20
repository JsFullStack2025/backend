import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersService} from './users/users.service';
import { CardsService } from './services/cards.service';
import { CardTypesService} from './services/cardTypes.service'
import { PrismaService } from './services/prisma.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AuthController } from './auth/auth.controller'
import { AuthService } from './auth/auth.service';
//import { MinioModule } from './services/minio/minio.module';
import { MinioController } from './services/minio/minio.controller';
import { MinioService } from './services/minio/minio.service';
//import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    AuthModule,
    UsersModule    
    ],
  controllers: [AppController, AuthController, MinioController],
  providers: [AuthService, MinioService, AppService, PrismaService, UsersService, CardsService, CardTypesService, MinioService],
})
export class AppModule {}
