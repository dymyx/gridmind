import { Component, OnInit } from '@angular/core';
import { forkJoin, Subject } from 'rxjs';
import { IRace } from '../../shared/types/api.types';
import { ResultService } from './result.service';
import { HomeService } from '../home/home.service';

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

  public tableColumns = tableConfig.global;

  constructor(
    private resultService: ResultService,
    private homeService: HomeService,
  ) {}

  ngOnInit(): void {
    this.loadRaces();
  }

  private loadRaces() {
    forkJoin({
      lastRaces: this.resultService.getLastRaces(),
      upcomingRace: this.homeService.getUpcomingRace(),
    }).subscribe(({ lastRaces, upcomingRace }) => {
      this.lastRaces = lastRaces ?? [];
      this.upcomingRace = upcomingRace ?? null;
    });
  }
}
