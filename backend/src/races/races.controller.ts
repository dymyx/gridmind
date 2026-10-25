import { Controller, Get, Query } from '@nestjs/common';
import { RacesService } from './races.service.js';

@Controller('races')
export class RacesController {
  constructor(private readonly racesService: RacesService) {}

  @Get('')
  findAllRaces() {
    return this.racesService.getAllRaces();
  }

  @Get('/upcoming')
  findUpcomingRace() {
    return this.racesService.upcomingRace();
  }

  @Get('/last')
  findLastRacesByCount(@Query('count') count: number) {
    return this.racesService.findLastRacesByCount(count);
  }
}
