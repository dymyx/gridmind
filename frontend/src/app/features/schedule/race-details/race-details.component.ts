import { Component, OnInit } from '@angular/core';
import configColumns from './table.config.json';
import { ActivatedRoute } from '@angular/router';
import { ScheduleService } from '../schedule.service';

@Component({
  selector: 'app-race-details',
  standalone: false,
  templateUrl: './race-details.component.html',
  styleUrl: './race-details.component.scss',
})
export class RaceDetailsComponent implements OnInit {
  public tableColumns = configColumns.race;

  // TODO: anigilate any
  public race: any | null = null;
  public results: any[] = [];

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
      this.results = (results ?? []).map((res: any) => ({
        number: Number(res.position),
        driver: `${res.driver.first_name} ${res.driver.last_name}`,
        team: res.team.name,
        status: res.status,
        points: res.points,
        team_color: res.team.color,
      }));
    });
  }
}
