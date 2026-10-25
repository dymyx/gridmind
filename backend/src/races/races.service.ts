import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { DictService } from '../dict/dict.service.js';

@Injectable()
export class RacesService {
  constructor(
    private prisma: PrismaService,
    private dictService: DictService,
  ) {}

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

  async findLastRacesByCount(count?: number) {
    const races = await this.prisma.race.findMany({
      where: {
        status: 'finished',
        season: { status: 'active' },
      },
      include: { circuit: true, qualifyings: true },
      orderBy: {
        round: 'desc',
      },
      take: Number(count) ?? 1,
    });

    return Promise.all(
      races.map(async ({ circuit, winnerId, qualifyings, ...rest }) => {
        const pole = qualifyings.find((quali) => quali.position === 1);

        return {
          ...rest,
          winnerId,
          winner: winnerId
            ? await this.dictService.getDriverByID(winnerId)
            : null,
          pole_winner: pole
            ? await this.dictService.getDriverByID(pole.driver_id)
            : null,
          pole_time: pole?.time,
          circuitName: circuit.name,
          country: circuit.country,
          city: circuit.city,
        };
      }),
    );
  }
}
