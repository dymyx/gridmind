import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class StandingsService {
  constructor(private prisma: PrismaService) {}

  getDriverStanding(year?: number) {
    return this.prisma.driverStanding.findMany({
      where: { season: year ? { year } : { status: 'active' } },
      include: { driver: true, team: true },
      orderBy: { position: 'asc' },
    });
  }

  getTeamStanding(year?: number) {
    return this.prisma.teamStanding.findMany({
      where: { season: year ? { year } : { status: 'active' } },
      include: { team: true },
      orderBy: { position: 'asc' },
    });
  }
}
