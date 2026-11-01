import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service.js'
import { ParsedResult, RaceResultsProvider } from './results-provider.js'

const DRIVERS = [
  { first: 'Max', last: 'Verstappen', team: 'Red Bull Racing', strength: 95 },
  { first: 'Isack', last: 'Hadjar', team: 'Red Bull Racing', strength: 70 },
  { first: 'Charles', last: 'Leclerc', team: 'Ferrari', strength: 90 },
  { first: 'Lewis', last: 'Hamilton', team: 'Ferrari', strength: 88 },
  { first: 'George', last: 'Russell', team: 'Mercedes', strength: 88 },
  { first: 'Kimi', last: 'Antonelli', team: 'Mercedes', strength: 82 },
  { first: 'Lando', last: 'Norris', team: 'McLaren', strength: 93 },
  { first: 'Oscar', last: 'Piastri', team: 'McLaren', strength: 91 },
  { first: 'Alexander', last: 'Albon', team: 'Williams', strength: 76 },
  { first: 'Carlos', last: 'Sainz', team: 'Williams', strength: 82 },
  { first: 'Liam', last: 'Lawson', team: 'Racing Bulls', strength: 72 },
  { first: 'Arvid', last: 'Lindblad', team: 'Racing Bulls', strength: 65 },
  { first: 'Fernando', last: 'Alonso', team: 'Aston Martin', strength: 80 },
  { first: 'Lance', last: 'Stroll', team: 'Aston Martin', strength: 68 },
  { first: 'Oliver', last: 'Bearman', team: 'Haas F1 Team', strength: 72 },
  { first: 'Esteban', last: 'Ocon', team: 'Haas F1 Team', strength: 75 },
  { first: 'Nico', last: 'Hülkenberg', team: 'Audi', strength: 74 },
  { first: 'Gabriel', last: 'Bortoleto', team: 'Audi', strength: 68 },
  { first: 'Pierre', last: 'Gasly', team: 'Alpine', strength: 74 },
  { first: 'Franco', last: 'Colapinto', team: 'Alpine', strength: 66 },
  { first: 'Valtteri', last: 'Bottas', team: 'Cadillac', strength: 78 },
  { first: 'Sergio', last: 'Pérez', team: 'Cadillac', strength: 74 },
];

const POINTS = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];

@Injectable()
export class MockResultsProvider implements RaceResultsProvider {
  constructor(private prisma: PrismaService) {}

  public async fetchResults(): Promise<ParsedResult[]> {
    const [drivers, teams] = await Promise.all([
      this.prisma.driver.findMany(),
      this.prisma.team.findMany(),
    ]);

    return DRIVERS.map((d) => {
      const driver = drivers.find((x) => x.first_name === d.first && x.last_name === d.last);
      const team = teams.find((x) => x.name === d.team);
      if (!driver || !team) {
        throw new Error(`Не найден пилот или команда: ${d.first} ${d.last} / ${d.team}`);
      }
      return { driverId: driver.id, teamId: team.id, score: d.strength + Math.random() * 20 };
    })
      .sort((a, b) => b.score - a.score)
      .map((r, i) => ({
        driverId: r.driverId,
        teamId: r.teamId,
        position: i + 1,
        points: POINTS[i] ?? 0,
        status: 'finished',
      }));
  }
}
