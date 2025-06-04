import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../src/app.controller';
import { AppService } from '../src/app.service';
import { UsersService } from '../src/users/users.service';
import { CardsService } from '../src/services/cards.service';
import { CardTypesService } from '../src/services/cardTypes.service';
import { JwtAuthGuard } from '../src/auth/jwt.guard';
import { UserGuard, AdminGuard } from '../src/auth/roles.guard';
import { PrismaService } from '../src/services/prisma.service';
import { CreateCardDto, UpdateCardDto } from '../src/Entities/Cards.dto';
import { NotFoundException } from '@nestjs/common';
import { CreateCardTypeDto } from '@/Entities/CardDesign.dto';

describe('AppController', () => {
  let controller: AppController;
  let usersService: UsersService;
  let cardsService: CardsService;
  let cardTypesService: CardTypesService;
  let appService: AppService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        PrismaService,
        UsersService,
        CardsService,
        CardTypesService,
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .overrideGuard(UserGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .overrideGuard(AdminGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .compile();

    controller = module.get<AppController>(AppController);
    prismaService = module.get<PrismaService>(PrismaService);
    usersService = module.get<UsersService>(UsersService);
    cardsService = module.get<CardsService>(CardsService);
    cardTypesService = module.get<CardTypesService>(CardTypesService);
    appService = module.get<AppService>(AppService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // TODO: User API tests
  describe('Users API', () => {
    const existUserId = 1;
    let testUserID=0;
    const userData = { username: 'TEST User', email: 'new@example.com', password: 'password' };
    describe('getUsers', () => {
      it('should return an array of users', async () => {
        const result = await controller.getUsers();
        expect(result.length).toBeGreaterThan(0);
      });
    });

    describe('getUserById', () => {
      it('should return a user by ID=1 alice', async () => {
        const result = await controller.getUserById(existUserId);
        expect(result?.id).toEqual(existUserId);
      });
    });

    // TODO: test CRUD for user
    describe('create User', () => {
      it('should create a new user', async () => {
        const userExists = await usersService.findOne(userData.username);
        if (!userExists) {
          const result = await controller.createUser(userData);
          testUserID = result.id;
          expect(result.username).toEqual(userData.username);
        } else {
          //console.log('User already exists');
          const existingUser = await usersService.findOne(userData.username);
          testUserID = existingUser?.id || 0;
          //console.log('User ID='+testUser);
          expect(existingUser?.username).toEqual(userData.username);
        }
        expect(testUserID).toBeGreaterThan(0);
      });
    });

    describe('patch User', () => {
      it('should update a user', async () => {
        const mockUser = { id: testUserID, username: userData.username, email: 'updated@example.com' };
        const result = await controller.patchUser(mockUser);
        expect(result.email).toEqual(mockUser.email);
      });
     });

    describe('remove User', () => {
      it('should delete a user', async () => {
        expect(testUserID).toBeGreaterThan(0);
        const result = await controller.removeUser(testUserID);
        expect(result.id).toEqual(testUserID);
      });
    });

    describe('get User Cards', () => {
      it('should return user cards', async () => {
        const result = await controller.getUserCards(1);
        expect(result?.length).toBeGreaterThan(0);
      });
    });
  });
});
