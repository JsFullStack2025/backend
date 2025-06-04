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

  describe('Root endpoint', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });
    it('should return from API true', () => {
      expect(controller.getHello().success).toBe(true);
    });
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

  // TODO: Cards API tests
  describe('Cards API', () => {
    const existCardID: number = 2;
    let testCardID: number = 0;
    const cardData: CreateCardDto = {
      authorId: 1,
      title: 'Test Card',
      sharedUrl: 'http://example.com',
      cardData: '{}',
      //designPrototypeId: 0,
      shared: true,
    };

    describe('get Cards', () => {
      it('should return all cards', async () => {
        const result = await controller.getCards();
        expect(result?.length).toBeGreaterThan(0);
      });
    });

    describe('get Card By Id', () => {
      it('should return a card by ID', async () => {
        const result = await controller.getCardById(existCardID);
        expect(result?.id).toEqual(existCardID);
      });
    });

    describe('create Card', () => {
      it('should create a new card', async () => {
        const result = await controller.createCard(cardData);
        testCardID = result.id;
        expect(result.id).toBeDefined();
        expect(result.authorId).toEqual(cardData.authorId);
       expect(result.title).toEqual(cardData.title);
      });
    });

    describe('patch Card', () => {
      it('should update a card', async () => {
        const updateData: UpdateCardDto = { id: testCardID, ...cardData };
        updateData.title = 'Updated Title';
        const result = await controller.patchCard(updateData);
        expect(result.title).toEqual('Updated Title');
      });
    });

    describe('remove Card', () => {
      it('should delete a card', async () => {
        expect(testCardID).toBeGreaterThan(0);
        const result = await controller.removeCard(testCardID);
        expect(result.id).toEqual(testCardID);
      });
    });
   });

   // TODO: CardTypes API tests
   describe('CardTypes API', () => {
    let testCardTypeID: number = 0;
    const cardTypeData: CreateCardTypeDto = { title: 'Test Card Type', description: 'Test Description' }

    describe('get Card Types', () => {
      it('should return all card types', async () => {
        const result = await controller.getCardTypes();
        expect(result?.length).toBeGreaterThan(0);
      });
    });

    describe('get CardTypes By Id', () => {
      it('should return a card type by ID', async () => {
        const result = await controller.getCardTypesById(1);
        expect(result?.id).toEqual(1);
      });

      it('should throw NotFoundException if card type not found', async () => {
        await expect(controller.getCardTypesById(0)).rejects.toThrow(NotFoundException);
      });
    });

    describe('createCardType', () => {
      it('should create a new card type', async () => {
        const result = await controller.createCardType(cardTypeData);
        testCardTypeID = result.id;
        expect(result.title).toEqual(cardTypeData.title);
        expect(result.description).toEqual(cardTypeData.description);
      });
    });

    describe('patch Card Type', () => {
      it('should update a card type', async () => {
        const updateData = { id: testCardTypeID, ...cardTypeData };
        updateData.title = 'Updated Title';
        const result = await controller.patchCardType(updateData);
        expect(result.title).toEqual(updateData.title);
      });

      it('should throw NotFoundException if card type not found', async () => {
        const updateData = { id: 0, title: 'Platinum Plus', description: 'Updated Description' };
        await expect(controller.patchCardType(updateData)).rejects.toThrow(NotFoundException);
      });
    });

    describe('remove Cardtype', () => {
      it('should delete a card type', async () => {
        expect(testCardTypeID).toBeGreaterThan(0);
        const result = await controller.removeCardtype(testCardTypeID);
        expect(result.id).toEqual(testCardTypeID);
      });

      it('should throw NotFoundException if card type not found', async () => {
        await expect(controller.removeCardtype(0)).rejects.toThrow(NotFoundException);
      });

      it('should throw NotFoundException if card type is readonly', async () => {
        await expect(controller.removeCardtype(1)).rejects.toThrow(NotFoundException);
      });
    });
   });
});
