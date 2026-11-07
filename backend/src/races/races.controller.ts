import {
  Controller,
  Get,
  Param,
  ParseBoolPipe,
  ParseEnumPipe,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from '../auth/admin.guard.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { Statuses } from '../generated/prisma/enums.js';
import { RacesService } from './races.service.js';
import { RaceResultsService } from './results/race-results.service.js';

@UseGuards(JwtAuthGuard)
@Controller('races')
export class RacesController {
  constructor(
    private racesService: RacesService,
    private raceResults: RaceResultsService,
  ) {}

  @Get('')
  findAllRacesNew(
    @Query('race_id') race_id?: string,
    @Query('order', new ParseEnumPipe(['asc', 'desc'], { optional: true }))
    order?: 'asc' | 'desc',
    @Query('qualifying', new ParseBoolPipe({ optional: true }))
    qualifying?: boolean,
    @Query('circuit', new ParseBoolPipe({ optional: true })) circuit?: boolean,
    @Query('count', new ParseIntPipe({ optional: true })) count?: number,
    @Query('qualifying_count', new ParseIntPipe({ optional: true }))
    qualifying_count?: number,
    @Query('race_status', new ParseEnumPipe(Statuses, { optional: true }))
    race_status?: Statuses,
    @Query('year', new ParseIntPipe({ optional: true }))
    year?: number,
  ) {
    return this.racesService.getRaces(
      race_id,
      order,
      count,
      qualifying,
      qualifying_count,
      circuit,
      race_status,
      year,
    );
  }

  @Get('/results')
  findRaceResultsById(
    @Query('race_id') race_id?: string,
    @Query('quali', new ParseBoolPipe({ optional: true })) quali?: boolean,
  ) {
    return this.racesService.getRaceResult(race_id, quali);
  }

  @Post(':id/results')
  @UseGuards(JwtAuthGuard, AdminGuard)
  public ingestResults(
    @Param('id') id: string,
    @Query('force') force?: string,
  ) {
    return this.raceResults.ingest(id, force === 'true');
  }

  @Post(':id/settle')
  @UseGuards(JwtAuthGuard, AdminGuard)
  public settle(@Param('id') id: string) {
    return this.raceResults.settle(id);
  }
}
