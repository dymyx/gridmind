import {
  Controller,
  Get,
  Param,
  ParseBoolPipe,
  ParseEnumPipe,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { RacesService } from './races.service.js';
import { Statuses } from '../generated/prisma/enums.js';

@Controller('races')
export class RacesController {
  constructor(private readonly racesService: RacesService) {}

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
    @Query('season_status', new ParseEnumPipe(Statuses, { optional: true }))
    season_status?: Statuses,
  ) {
    return this.racesService.getRaces(
      race_id,
      order,
      count,
      qualifying,
      qualifying_count,
      circuit,
      race_status,
      season_status,
    );
  }

  @Get('/results')
  findRaceResultsById(@Query('id') id: string) {
    return this.racesService.getAllRaceResultsById(id);
  }
}
