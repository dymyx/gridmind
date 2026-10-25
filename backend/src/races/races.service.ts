import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { DictService } from '../dict/dict.service.js';

@Injectable()
export class RacesService {
  constructor(
    private prisma: PrismaService,
    private dictService: DictService,
  ) {}

  async getAllRaces() {
    const races = await this.prisma.race.findMany({
      where: {
        season: { status: 'active' },
      },
      orderBy: { round: 'asc' },
    });

    return Promise.all(
      races.map(async ({ winnerId, ...rest }) => {
        return {
          ...rest,
          winnerId,
          winner: winnerId
            ? await this.dictService.getDriverByID(winnerId)
            : null,
        };
      }),
    );
  }

  async getAllRaceResultsById(race_id: string) {
    const races = await this.prisma.raceResult.findMany({
      where: {
        race_id,
      },
      include: { driver: true, team: true },
    });

    // TODO: extract qualifyings to abstract method

    return Promise.all(
      races.map(async ({ race_id, ...rest }) => {
        return {
          ...rest,
          race_id,
          qualifyings: race_id
            ? await this.prisma.qualifying.findMany({ where: { race_id } })
            : null,
        };
      }),
    );
  }

  async getRaceById(id: string) {
    const race = await this.prisma.race.findFirst({
      where: {
        id,
      },
      include: {
        circuit: true,
        qualifyings: {
          orderBy: { position: 'asc' },
          take: 5,
          include: { driver: true },
        },
      },
    });

    if (!race) throw new NotFoundException(`Race ${id} not found`);

    const { winnerId, ...rest } = race;

    return {
      ...rest,
      winnerId,
      winner: winnerId ? await this.dictService.getDriverByID(winnerId) : null,
    };
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
