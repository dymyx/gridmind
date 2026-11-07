import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreatePredictionDto } from './predictions.dto.js';

@Injectable()
export class PredictionsService {
  constructor(private prisma: PrismaService) {}

  public getUserPredictions(user_id: string, race_id?: string, count?: number) {
    return this.prisma.prediction.findMany({
      where: { user_id, race_id },
      include: {
        results: {
          include: { driver: true },
          orderBy: { predicted_position: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
      ...(count && { take: count }),
    });
  }

  public async getTopPredictsByRace(race_id: string, count = 5) {
    const predictions = await this.prisma.prediction.findMany({
      where: { race_id, scoredAt: { not: null } },
      include: {
        results: true,
        user: { select: { id: true, username: true } },
      },
    });

    return predictions
      .map(({ results, ...rest }) => ({
        ...rest,
        total_points: results.reduce((sum, r) => sum + r.points, 0),
      }))
      .sort(
        (a, b) =>
          b.total_points - a.total_points ||
          a.createdAt.getTime() - b.createdAt.getTime(),
      )
      .slice(0, count);
  }

  /**
   * Метод для проверки окна приема прогноза.
   * Проверяет что до гонки осталось больше 5 часов.
   * @param race_id - ID гонки
   * @returns
   */
  private async isPredictionOpen(race_id: string) {
    const race = await this.prisma.race.findUnique({
      where: { id: race_id },
    });

    if (!race) {
      throw new NotFoundException();
    }

    if (race.status === 'finished') {
      return false;
    }

    const deltaTime = 5 * 60 * 60 * 1000;

    return new Date().getTime() > race.raceDate.getTime() - deltaTime
      ? false
      : true;
  }

  /**
   * Функция проверки можно ли делать прогноз или нет
   * @param race_id - айди гонки
   * @param user_id - айди пользователя
   * @returns true/false
   */
  public async getCanPredict(race_id: string, user_id: string) {
    // Проверяем можно ли вообще сделать прогноз для гонки
    const checkRace = await this.isPredictionOpen(race_id);

    if (!checkRace) {
      return false;
    }

    // Проверяем есть ли у нас прогноз уже от пользователя
    const prediction = await this.prisma.prediction.findFirst({
      where: { race_id, user_id },
      select: { id: true },
    });

    return prediction === null;
  }

  /**
   * Метод для создания прогноза
   * @param user_id - айди пользователя
   * @param dto - данные прогноза
   * @returns
   */
  public async createPredict(user_id: string, dto: CreatePredictionDto) {
    const canPredict = await this.getCanPredict(dto.race_id, user_id);

    if (!canPredict) {
      throw new ForbiddenException();
    }

    // Проверяем уникальность
    const positions = dto.predicts.map((p) => p.pos);
    const driversIDS = dto.predicts.map((p) => p.driverId);

    if (
      new Set(positions).size !== positions.length ||
      new Set(driversIDS).size !== driversIDS.length
    ) {
      throw new BadRequestException();
    }

    return this.prisma.prediction.create({
      data: {
        user_id,
        race_id: dto.race_id,
        results: {
          create: dto.predicts.map((p) => ({
            driver_id: p.driverId,
            predicted_position: p.pos,
          })),
        },
      },
      include: { results: true },
    });
  }
}
