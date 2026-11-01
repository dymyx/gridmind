import { Injectable } from '@nestjs/common';
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

  public async getCanPredict(race_id: string, user_id: string) {
    const prediction = await this.prisma.prediction.findFirst({
      where: { race_id, user_id },
      select: { id: true },
    });

    return prediction === null;
  }

  public createPredict(user_id: string, dto: CreatePredictionDto) {
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
