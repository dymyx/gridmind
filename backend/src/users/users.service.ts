import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findUserByUsername(username: string) {
    return this.prisma.user.findUnique({ where: { username } });
  }

  async createUser(username: string, passwordHash: string, data: any) {
    return this.prisma.user.create({
      data: {
        username,
        password: passwordHash,
        favoriteDriverId: data.favoriteDriverId ?? null,
        favoriteTeamId: data.favoriteTeamId ?? null,
      },
      select: { id: true, username: true, createdAt: true },
    });
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        createdAt: true,
        favoriteDriver: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            number: true,
            country: true,
            birth_date: true,
            image_url: true,
            driverStandings: {
              where: { season: { status: 'active' } },
              select: { position: true, points: true, wins: true },
              take: 1,
            },
          },
        },
        favoriteTeam: {
          select: {
            id: true,
            name: true,
            color: true,
            principal: true,
            teamStandings: {
              where: { season: { status: 'active' } },
              select: { position: true, points: true, wins: true },
              take: 1,
            },
          },
        },
        userStats: true,
      },
    });

    if (!user) throw new NotFoundException();

    const { favoriteDriver, favoriteTeam, ...rest } = user;

    return {
      ...rest,
      favoriteDriver: favoriteDriver
        ? {
            ...favoriteDriver,
            driverStandings: undefined,
            standing: favoriteDriver.driverStandings[0] ?? null,
          }
        : null,
      favoriteTeam: favoriteTeam
        ? {
            ...favoriteTeam,
            teamStandings: undefined,
            standing: favoriteTeam.teamStandings[0] ?? null,
          }
        : null,
    };
  }
}
