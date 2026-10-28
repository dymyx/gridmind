import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { DictService } from '../dict/dict.service.js';
import { Statuses } from '../generated/prisma/enums.js';

@Injectable()
export class RacesService {
  constructor(
    private prisma: PrismaService,
    private dictService: DictService,
  ) {}

  /**
   * Метод получения гонок по критериям
   * @param race_id - по ID
   * @param count - количество отдаваемых гонок
   * @param qualifying - нужен ли в ответ квалификации + pole
   * @param circuit - информация по трассе
   * @param race_status - статус гонки 'upcoming | finished'
   * @param season_status - статус сезона
   * @returns - массив гонок
   */
  async getRaces(
    race_id?: string,
    order: 'asc' | 'desc' = 'asc',
    count?: number,
    qualifying: boolean = false,
    qualifying_count?: number,
    circuit: boolean = false,
    race_status?: string,
    season_status: Statuses = 'active',
  ) {
    const races = await this.prisma.race.findMany({
      where: {
        ...(race_id && { id: race_id }),
        ...(race_status && { status: race_status }),
        season: { status: season_status },
      },
      include: {
        circuit: circuit,
        qualifyings: qualifying
          ? {
              orderBy: { position: 'asc' },
              include: { driver: true },
              ...(qualifying_count && { take: qualifying_count }),
            }
          : false,
      },
      orderBy: { round: order },
      ...(count && { take: Number(count) }),
    });

    return Promise.all(
      races.map(async ({ winnerId, qualifyings, ...rest }) => {
        const pole = qualifyings?.find((quali) => quali.position === 1);

        return {
          ...rest,
          winnerId,
          winner: winnerId
            ? await this.dictService.getDriverByID(winnerId)
            : null,
          ...(pole && {
            poleID: pole.id,
            pole_winner: await this.dictService.getDriverByID(pole.driver_id),
            pole_time: pole.time,
          }),
          ...(qualifyings && { qualifyings }),
        };
      }),
    );
  }

  /**
   * Получение результатов гонки
   * @param race_id - айди гонки
   * @returns - массив данных
   */
  async getAllRaceResultsById(race_id: string) {
    const [results, qualifyings] = await Promise.all([
      this.prisma.raceResult.findMany({
        where: { race_id },
        include: { driver: true, team: true },
      }),
      this.getQualifyingsByRaceId(race_id),
    ]);

    return { results, qualifyings };
  }

  private getQualifyingsByRaceId(race_id: string) {
    return this.prisma.qualifying.findMany({
      where: { race_id },
      orderBy: { position: 'asc' },
    });
  }
}
