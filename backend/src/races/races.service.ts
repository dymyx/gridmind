import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class RacesService {
  constructor(private prisma: PrismaService) {}

  getAllRaces() {
    return this.prisma.race.findMany({
      where: {
        season: { status: 'active' },
      },
    });
  }

  async upcomingRace() {
    const race = await this.prisma.race.findFirst({
      where: {
        status: 'upcoming',
        season: { status: 'active' },
      },
      include: { circuit: true },
      orderBy: {
        round: 'asc',
      },
    });

    if (!race) return null;

    const { circuit, ...rest } = race;

    return {
      ...rest,
      circuitName: circuit.name,
      country: circuit.country,
      city: circuit.city,
    };
  }
}
