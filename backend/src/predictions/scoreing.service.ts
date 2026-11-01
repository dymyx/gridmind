import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { scorePredictionResult } from './scoring.rules.js';

@Injectable()
export class ScoringService {
  constructor(private prisma: PrismaService) {}

  public settleRace(race_id: string) {
    return this.prisma.$transaction(
      async (tx) => {
        const results = await tx.raceResult.findMany({ where: { race_id } });
        if (!results.length) {
          throw new BadRequestException('Для гонки нет результатов');
        }

        const actualByDriver = new Map<string, number>();
        for (const r of results) {
          if (r.position !== null) actualByDriver.set(r.driver_id, Number(r.position));
        }

        const predictions = await tx.prediction.findMany({
          where: { race_id },
          include: { results: true },
        });

        const scoredAt = new Date();

        for (const prediction of predictions) {
          for (const pr of prediction.results) {
            const { id, actual_position, points } = scorePredictionResult(pr, actualByDriver);
            await tx.predictionResult.update({
              where: { id },
              data: { actual_position, points },
            });
          }
          await tx.prediction.update({
            where: { id: prediction.id },
            data: { scoredAt },
          });
        }

        const winner = results.find((r) => r.position === '1');
        await tx.race.update({
          where: { id: race_id },
          data: { status: 'finished', winnerId: winner?.driver_id ?? null },
        });

        return { predictionsScored: predictions.length };
      },
      { timeout: 30_000 },
    );
  }
}
