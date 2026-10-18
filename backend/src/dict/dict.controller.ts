import { Controller, Get, Param, Query } from '@nestjs/common';
import { DictService } from './dict.service.js';

@Controller('dict')
export class DictController {
  constructor(private readonly dictService: DictService) {}

  // # TEAM ------------------------------
  @Get('teams')
  findAllTeam() {
    return this.dictService.getAllTeams();
  }

  @Get('teams/:id')
  findTeamById(@Param('id') id: string) {
    return this.dictService.getTeamByID(id);
  }

  @Get('teams/name/:name')
  findTeamByName(@Param('name') name: string) {
    return this.dictService.getTeamByName(name);
  }

  // # DRIVERS ---------------------------------
  @Get('drivers')
  findDrivers() {
    return this.dictService.getAllDrivers();
  }

  @Get('drivers/:id')
  findDriverById(@Param('id') id: string) {
    return this.dictService.getDriverByID(id);
  }

  @Get('drivers/number/:number')
  findDriversByNumber(@Param('number') number: string) {
    return this.dictService.getDriversByNumber(+number);
  }

  // # CIRCUITS ---------------------------------
  @Get('circuits')
  findCircuits(
    @Query('country') country?: string,
    @Query('city') city?: string,
  ) {
    return this.dictService.getCircuits({ country, city });
  }

  @Get('circuits/:id')
  findCircuitById(@Param('id') id: string) {
    return this.dictService.getCircuitByID(id);
  }

  // # SEASONS ---------------------------------
  @Get('seasons')
  findAllSeasons() {
    return this.dictService.getAllSeasons();
  }

  @Get('seasons/:year')
  findSeasonByYear(@Param('year') year: string) {
    return this.dictService.getSeasonByYear(+year);
  }
}
