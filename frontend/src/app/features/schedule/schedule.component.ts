import { Component, OnInit } from '@angular/core';
import { ScheduleService } from './schedule.service';
import { forkJoin } from 'rxjs';
import { IRace } from '../../shared/types/api.types';
import { Router } from '@angular/router';

@Component({
  selector: 'app-schedule',
  standalone: false,
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss',
})
export class ScheduleComponent implements OnInit {
  public races: IRace[] = [];

  constructor(
    private scheduleService: ScheduleService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData() {
    forkJoin({
      races: this.scheduleService.getAllRaces(),
    }).subscribe(({ races }) => {
      this.races = races || [];
    });
  }

  public onRaceClick(id: string) {
    this.router.navigate(['/schedule', id]);
  }
}
