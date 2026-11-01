import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IRace, IResult, ITopPredictions, IUserPrediction } from '../../../shared/types/api.types';
import { IResultRow } from '../../../shared/types/table.types';
import { ScheduleService } from '../schedule.service';
import configColumns from './table.config.json';

@Component({
  selector: 'app-race-details',
  standalone: false,
  templateUrl: './race-details.component.html',
  styleUrl: './race-details.component.scss',
})
export class RaceDetailsComponent implements OnInit {
  public tableColumns = configColumns.race;
  public race: IRace | null = null;
  public results: IResultRow[] = [];
  public top3: IResultRow[] = [];
  public userPrediction: IUserPrediction | null = null;
  public predictions: ITopPredictions[] = [];

  constructor(
    private route: ActivatedRoute,
    private scheduleService: ScheduleService,
  ) {}

  ngOnInit(): void {
    // получаем id гонки
    const raceID = this.route.snapshot.paramMap.get('id');

    if (raceID) {
      this.loadRace(raceID);
      this.loadData(raceID);
    }
  }

  private loadRace(raceId: string) {
    this.scheduleService.getRaceById(raceId).subscribe((race) => (this.race = race ?? null));
  }

  private loadData(raceId: string) {
    this.scheduleService.getRaceResultsById(raceId).subscribe(({ results }) => {
      this.results = (results ?? []).map((res: IResult): IResultRow => ({
        number: Number(res.position),
        driver: `${res.driver.first_name} ${res.driver.last_name}`,
        team: res.team.name,
        status: res.status,
        points: res.points,
        team_color: res.team.color,
      }));
      this.top3 = this.results.slice(0, 3);
      this.results = this.results.slice(3, this.results.length);
    });
    this.scheduleService.getTopPredicts(raceId, 5).subscribe((predictions) => {
      this.predictions = predictions ?? [];
    });
    this.scheduleService.getUserRacePredict(raceId).subscribe((prediction) => {
      this.userPrediction = prediction[0] ?? null;
    });
  }
}
