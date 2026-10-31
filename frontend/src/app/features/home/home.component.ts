import { Dialog } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import type { ColDef } from 'ag-grid-community';
import { finalize, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { PredictDialogComponent } from '../../shared/dialogs/predict/predict.component';
import {
  IDriver,
  IDriverStanding,
  IRace,
  ITeamStanding,
  IUsersGlobalStanding,
} from '../../shared/types/api.types';
import { IDriverRow, ITeamRow, IUserRow } from '../../shared/types/table.types';
import { HomeService } from './home.service';
import tableConfig from './table.config.json';

type StandingMode = 'drivers' | 'teams' | 'players';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private columnsConfig = tableConfig as Record<StandingMode, ColDef[]>;
  public loading: boolean = false;
  public canPredict: boolean = true;

  public upcomingRace: IRace | null = null;
  public lastRace: IRace | null = null;
  public countdown$?: Observable<any>;

  public mode: StandingMode = 'drivers';
  public tableColumns = this.columnsConfig[this.mode];
  public tableData: (IDriverRow | ITeamRow | IUserRow)[] = [];

  private drivers: IDriverRow[] = [];
  private teams: ITeamRow[] = [];
  private global: IUserRow[] = [];

  private driversLits: IDriver[] = [];

  constructor(
    private homeService: HomeService,
    private dialog: Dialog,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.loadData();
  }

  private loadData() {
    forkJoin({
      drivers: this.homeService.getDriverStanding(),
      teams: this.homeService.getTeamStanding(),
      global: this.homeService.getGlobalStanding(),
      lastRace: this.homeService.getLastRace(),
      race: this.homeService
        .getUpcomingRace()
        .pipe(
          switchMap((upcomingRace) =>
            upcomingRace
              ? this.homeService
                  .canPredict(upcomingRace.id)
                  .pipe(map((canPredict) => ({ upcomingRace, canPredict })))
              : of({ upcomingRace: null, canPredict: false }),
          ),
        ),
    })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(({ drivers, teams, global, lastRace, race }) => {
        this.driversLits = drivers.map((row) => row.driver);

        this.drivers = this.buildFieldsDrivers(drivers);
        this.teams = this.buildFieldsTeams(teams);
        this.global = this.buildFieldsGlobalUsers(global);
        this.lastRace = lastRace ?? null;
        this.upcomingRace = race.upcomingRace;
        this.canPredict = race.canPredict;

        this.tableData =
          this.mode === 'drivers' ? this.drivers : this.mode === 'teams' ? this.teams : this.global;
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

  private buildFieldsGlobalUsers(rows: IUsersGlobalStanding[]): IUserRow[] {
    return rows.map((row) => ({
      number: row.number,
      username: row.username,
      points: row.points,
      predictions: row.predictions,
      correct: row.correct,
    }));
  }

  public switchFilter(mode: StandingMode) {
    this.mode = mode;
    this.tableColumns = this.columnsConfig[mode];
    this.tableData =
      mode === 'drivers' ? this.drivers : mode === 'teams' ? this.teams : this.global;
  }

  public openPredict() {
    if (!this.upcomingRace || !this.canPredict) return;

    this.dialog
      .open(PredictDialogComponent, {
        data: { raceId: this.upcomingRace.id, drivers: this.driversLits },
      })
      .closed.subscribe((result) => {
        if (result) {
          this.homeService.setPrediction(result).subscribe({
            next: (res) => {
              console.log('Res', res);
            },
          });
        }
      });
  }
}
