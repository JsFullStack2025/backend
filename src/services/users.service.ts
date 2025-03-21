import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Users, Prisma } from '@prisma/client';
import { IResponseResult } from '../Entities/IResponseResult';
import { CreateUsersDto, UpdateUserDto } from '@/Entities/Users.dto';
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async user(
    userWhereUniqueInput: Prisma.UsersWhereUniqueInput,
  ): Promise<Users | null> {
    return this.prisma.users.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async users(): Promise<Users[]> {
    return this.prisma.users.findMany();
  }

  async createUser(userdata: CreateUsersDto): Promise<Users> {
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

  async deleteUser(userid: number): Promise<Users> {
    return this.prisma.users.delete({
      where: { id: userid }
    });
  }
}