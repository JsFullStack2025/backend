import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Users } from '@prisma/client';
import { CreateUsersDto, UpdateUserDto } from '@/Entities/Users.dto';
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async userById(userid:number): Promise<Users | null> {
    return this.prisma.users.findUnique({
      where: {id:userid},
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