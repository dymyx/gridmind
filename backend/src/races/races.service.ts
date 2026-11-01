import { Injectable } from '@nestjs/common';
import { DictService } from '../dict/dict.service.js';
import { Statuses } from '../generated/prisma/enums.js';
import { PrismaService } from '../prisma/prisma.service.js';

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
    year?: number,
  ) {
    const seasonFilter = race_id
      ? undefined
      : { season: year ? { year } : { status: 'active' as Statuses } };

    const races = await this.prisma.race.findMany({
      where: {
        ...(race_id && { id: race_id }),
        ...(race_status && { status: race_status }),
        ...seasonFilter,
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
        _count: { select: { predictions: true } },
      },
      orderBy: { round: order },
      ...(count && { take: Number(count) }),
    });

    return Promise.all(
      races.map(async ({ winnerId, qualifyings, _count, ...rest }) => {
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
          predidctions_count: _count.predictions,
          ...(qualifyings && { qualifyings }),
        };
      }),
    );
  }
  async getRaceResult(race_id?: string, quali: boolean = false) {
    // Если race_id не передан - ищем последнюю завершенную
    const seasonFilter = race_id
      ? undefined
      : { season: { status: 'active' as Statuses } };
    const race = await this.prisma.race.findFirst({
      where: { status: 'finished', id: race_id, ...seasonFilter },
      orderBy: { round: 'desc' },
      select: { id: true, raceName: true, round: true },
    });

    if (!race) return null;

    const [results, qualifyings] = await Promise.all([
      this.prisma.raceResult.findMany({
        where: { race_id: race.id },
        orderBy: { position: 'asc' },
        include: { driver: true, team: true },
      }),
      quali ? this.getQualifyingsByRaceId(race.id) : undefined,
    ]);

    return {
      race_id: race.id,
      race_name: race.raceName,
      round: race.round,
      results: results.sort(
        (a, b) =>
          this.positionOrder(a.position) - this.positionOrder(b.position),
      ),
      ...(qualifyings && { qualifyings }),
    };
  }

  private getQualifyingsByRaceId(race_id: string) {
    return this.prisma.qualifying.findMany({
      where: { race_id },
      orderBy: { position: 'asc' },
    });
  }

  private positionOrder(position: string | null): number {
    if (position === null || Number.isNaN(position)) {
      return 99999;
    }
    return Number(position);
  }
}
