import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { Cards, Users } from '@prisma/client';
import { CreateUsersDto, UpdateUserDto, UpdateUserTokenDto } from '@/Entities/Users.dto';
import * as argon2 from 'argon2';
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async userById(userid: number): Promise<Users | null> {
    return this.prisma.users.findUnique({
      where: { id: userid },
    });
  }
  async getUserCards(userid: number): Promise<Cards[] | null> {
    return this.prisma.cards.findMany({
      where: { authorId: userid }
    })
  }
  async users(): Promise<Users[]> {
    return this.prisma.users.findMany();
  }

  async createUser(userdata: CreateUsersDto): Promise<Users> {
    const pwd = await argon2.hash(userdata.password);
    userdata.password = pwd;
    let user: CreateUsersDto
    return this.prisma.users.create({
      data: userdata
    });
  }

  async updateUser(userdata: UpdateUserDto): Promise<Users> {
    return this.prisma.users.update({
      where: { id: userdata.id },
      data: userdata,
    });
  }

  async updateUserRefreshToken(userData: UpdateUserTokenDto): Promise<Users> {
    const user = await this.findAny({
      where: { id: userData.id }
    })
    return this.prisma.users.update({
      where: { id: userData.id },
      data: userData,
    });
  }

  async deleteUser(userid: number): Promise<Users> {
    return this.prisma.users.delete({
      where: { id: userid }
    });
  }

  async findOne(email: string): Promise<Users | undefined | null> {
    return this.prisma.users.findFirst({ where: { email: email } });
  }
  async findAny(params: any): Promise<Users | undefined | null> {
    return this.prisma.users.findFirst(params);
  }
}