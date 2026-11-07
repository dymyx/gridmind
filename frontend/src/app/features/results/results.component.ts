import { Component, OnInit } from '@angular/core';
import { forkJoin, Subject } from 'rxjs';
import { IRace, IUserSeasonStanding } from '../../shared/types/api.types';
import { ResultService } from './result.service';

import { Router } from '@angular/router';
import { DictService } from '../../services/dict.service';
import { RacesService } from '../../services/races.service';
import tableConfig from './table.config.json';

@Component({
  selector: 'app-results',
  standalone: false,
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss',
})
export class ResultsComponent implements OnInit {
  private destroy$ = new Subject<void>();
  public loading: boolean = false;

  public lastRaces: IRace[] = [];
  public upcomingRace: IRace | null = null;
  public globalStanding: IUserSeasonStanding[] = [];

  public tableColumns = tableConfig.global;

  constructor(
    private resultService: ResultService,
    private racesService: RacesService,
    private dictService: DictService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData() {
    forkJoin({
      lastRaces: this.resultService.getLastRaces(),
      upcomingRace: this.racesService.getUpcomingRace(),
      global: this.dictService.getSeasonUserStanding(),
    }).subscribe(({ lastRaces, upcomingRace, global }) => {
      this.lastRaces = lastRaces ?? [];
      this.upcomingRace = upcomingRace ?? null;
      this.globalStanding = global ?? [];
    });
  }

  public onClickGrandPrix(id: string) {
    this.router.navigate(['/schedule', id]);
  }
}
