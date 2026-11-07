import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { StandingsService } from './standings.service.js';

@UseGuards(JwtAuthGuard)
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
