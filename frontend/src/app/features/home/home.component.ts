import { Dialog } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import type { ColDef } from 'ag-grid-community';
import { EMPTY, filter, finalize, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { DictService } from '../../services/dict.service';
import { PredictionsService } from '../../services/predictions.service';
import { RacesService } from '../../services/races.service';
import { PredictDialogComponent } from '../../shared/dialogs/predict/predict.component';
import {
  IDriver,
  IDriverStanding,
  IRace,
  IRaceResult,
  ITeamStanding,
  IUserPrediction,
  IUsersGlobalStanding,
} from '../../shared/types/api.types';
import { IDriverRow, ITeamRow, IUserRow } from '../../shared/types/table.types';
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
  public lastRace: IRaceResult | null = null;
  public lastPrediction: IUserPrediction | null = null;
  public countdown$?: Observable<any>;

  public mode: StandingMode = 'drivers';
  public tableColumns = this.columnsConfig[this.mode];
  public tableData: (IDriverRow | ITeamRow | IUserRow)[] = [];

  private drivers: IDriverRow[] = [];
  private teams: ITeamRow[] = [];
  private global: IUserRow[] = [];

  private driversLists: IDriver[] = [];

  constructor(
    private racesService: RacesService,
    private dictService: DictService,
    private predictionsService: PredictionsService,
    private dialog: Dialog,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.loadData();
  }

  private loadData() {
    forkJoin({
      drivers: this.dictService.getDriverStanding(),
      teams: this.dictService.getTeamStanding(),
      global: this.dictService.getGlobalUserStanding(),
      lastData: this.racesService
        .getRaceResult()
        .pipe(
          switchMap((lastRace) =>
            lastRace
              ? this.predictionsService
                  .getUserPredictionByRace(lastRace.race_id)
                  .pipe(map((lastPrediction) => ({ lastRace, lastPrediction })))
              : of({ lastRace: null, lastPrediction: null }),
          ),
        ),

      race: this.racesService
        .getUpcomingRace()
        .pipe(
          switchMap((upcomingRace) =>
            upcomingRace
              ? this.predictionsService
                  .canPredict(upcomingRace.id)
                  .pipe(map((canPredict) => ({ upcomingRace, canPredict })))
              : of({ upcomingRace: null, canPredict: false }),
          ),
        ),
    })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(({ drivers, teams, global, lastData, race }) => {
        this.driversLists = drivers.map((row) => row.driver);

        this.drivers = this.buildFieldsDrivers(drivers);
        this.teams = this.buildFieldsTeams(teams);
        this.global = this.buildFieldsGlobalUsers(global);
        this.lastRace = lastData.lastRace
          ? {
              ...lastData.lastRace,
              results: lastData.lastRace.results.slice(0, 3),
            }
          : null;
        this.lastPrediction = lastData.lastPrediction;
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

  private buildDialogData(race: IRace): Observable<any> {
    const base = { raceId: race.id, drivers: this.driversLists };

    if (this.canPredict) {
      return of({ ...base, type: 'create' });
    }

    return this.predictionsService.getUserPredictionByRace(race.id).pipe(
      switchMap((prediction) =>
        prediction
          ? of({
              ...base,
              type: 'view' as const,
              values: Object.fromEntries(
                prediction.results?.map((r) => [`p${r.predicted_position}`, r.driver_id]) ?? [],
              ),
            })
          : EMPTY,
      ),
    );
  }

  public openPredict() {
    if (!this.upcomingRace) return;

    this.buildDialogData(this.upcomingRace)
      .pipe(
        switchMap((data) => this.dialog.open(PredictDialogComponent, { data }).closed),
        filter(Boolean), // в режиме view диалог закрывается без результата
        switchMap((result) => this.predictionsService.setPrediction(result)),
      )
      .subscribe(() => (this.canPredict = false));
  }
}
