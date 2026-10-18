import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findUserByUsername(username: string) {
    return this.prisma.user.findUnique({ where: { username } });
  }

  async createUser(username: string, passwordHash: string) {
    return this.prisma.user.create({
      data: { username, password: passwordHash },
      select: { id: true, username: true, createdAt: true },
    });
  }
}
