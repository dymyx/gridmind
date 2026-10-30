import { Controller, Get } from '@nestjs/common';
import { StandingsService } from './standings.service.js';

@Controller('standings')
export class StandingsController {
  constructor(private readonly standingsService: StandingsService) {}

  @Get('drivers')
  getDriverStanding() {
    return this.standingsService.getDriverStanding();
  }

  @Get('team')
  getTeamStanding() {
    return this.standingsService.getTeamStanding();
  }

  @Get('users/global')
  asngetUserGlobalStanding() {
    return this.standingsService.getUserStandings(false);
  }

  @Get('users/season')
  getUserSeasonStanding() {
    return this.standingsService.getUserStandings(true);
  }
}
