import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RacesService } from '../../services/races.service';
import { IRace } from '../../shared/types/api.types';

@Component({
  selector: 'app-schedule',
  standalone: false,
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss',
})
export class ScheduleComponent implements OnInit {
  public races: IRace[] = [];
  public years = [2026, 2025];
  public selectedYear = this.years[0];

  constructor(
    private racesService: RacesService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.changeSchedule(this.selectedYear);
  }

  public changeSchedule(year: number) {
    this.selectedYear = year;
    this.racesService.getAllRaces(year).subscribe((races) => (this.races = races ?? []));
  }

  public onRaceClick(id: string) {
    this.router.navigate(['/schedule', id]);
  }
}
