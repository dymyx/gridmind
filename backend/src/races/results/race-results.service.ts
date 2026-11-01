import { ConflictException, Inject, Injectable } from '@nestjs/common'
import { ScoringService } from '../../predictions/scoreing.service.js'
import { PrismaService } from '../../prisma/prisma.service.js'
import { RESULTS_PROVIDER, type RaceResultsProvider } from './results-provider.js'

@Injectable()
export class RaceResultsService {
  constructor(
    private prisma: PrismaService,
    private scoring: ScoringService,
    @Inject(RESULTS_PROVIDER) private provider: RaceResultsProvider,
  ) {}

  // Создаёт результаты гонки. Если они уже есть, отказывает (без force)
  public async ingest(race_id: string, force = false) {
    const existing = await this.prisma.raceResult.count({ where: { race_id } });
    if (existing > 0 && !force) {
      throw new ConflictException('Результаты уже есть. Используй force=true, чтобы перезаписать');
    }

    const parsed = await this.provider.fetchResults(race_id);

    await this.prisma.$transaction([
      this.prisma.raceResult.deleteMany({ where: { race_id } }),
      this.prisma.raceResult.createMany({
        data: parsed.map((r) => ({
          race_id,
          driver_id: r.driverId,
          team_id: r.teamId,
          position: String(r.position),
          points: r.points,
          status: r.status,
        })),
      }),
    ]);

    return { results: parsed.length };
  }

  public settle(race_id: string) {
    return this.scoring.settleRace(race_id);
  }
}
