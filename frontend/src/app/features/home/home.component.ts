import { Component, OnInit } from '@angular/core';
import { HomeService } from './home.service';
import { finalize, forkJoin, Observable } from 'rxjs';
import tableConfig from './table.config.json';
import type { ColDef } from 'ag-grid-community';
import { IDriverStanding, IRace, ITeamStanding } from '../../shared/types/api.types';
import { IDriverRow, ITeamRow } from '../../shared/types/table.types';

type StandingMode = 'drivers' | 'teams';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private columnsConfig = tableConfig as Record<StandingMode, ColDef[]>;
  public loading: boolean = false;

  public upcomingRace: IRace | null = null;
  public countdown$?: Observable<any>;

  public mode: StandingMode = 'drivers';
  public tableColumns = this.columnsConfig[this.mode];
  public tableData: (IDriverRow | ITeamRow)[] = [];

  private drivers: IDriverRow[] = [];
  private teams: ITeamRow[] = [];

  constructor(private homeService: HomeService) {}

  ngOnInit(): void {
    this.loading = true;
    this.loadRaces();
    this.loadStandings();
  }

  private loadRaces() {
    this.homeService.getUpcomingRace().subscribe({
      next: (race) => (this.upcomingRace = race ?? null),
      error: () => (this.upcomingRace = null),
    });
  }

  private loadStandings() {
    forkJoin({
      drivers: this.homeService.getDriverStanding(),
      teams: this.homeService.getTeamStanding(),
    })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(({ drivers, teams }) => {
        this.drivers = this.buildFieldsDrivers(drivers);
        this.teams = this.buildFieldsTeams(teams);

        this.tableData = this.mode === 'drivers' ? this.drivers : this.teams;
      });
  }

  private buildFieldsDrivers(rows: IDriverStanding[]): IDriverRow[] {
    return rows.map((row) => ({
      number: row.position,
      driver: `${row.driver.first_name} ${row.driver.last_name}`,
      team: row.team?.name,
      points: row.points,
      wins: row.wins,
    }));
  }

  private buildFieldsTeams(rows: ITeamStanding[]): ITeamRow[] {
    return rows.map((row) => ({
      number: row.position,
      principal: row.team?.principal,
      team: row.team?.name,
      points: row.points,
      wins: row.wins,
    }));
  }

  public switchFilter(mode: StandingMode) {
    this.mode = mode;
    this.tableColumns = this.columnsConfig[mode];
    this.tableData = mode === 'drivers' ? this.drivers : this.teams;
  }
}
