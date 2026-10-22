import { Component, OnInit } from '@angular/core';
import { HomeService } from './home.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  public upcomingRace: any;

  constructor(private homeService: HomeService) {}

  ngOnInit(): void {
    this.loadRaces();
  }

  private loadRaces() {
    this.homeService.getUpcomingRace().subscribe((race) => (this.upcomingRace = race ?? {}));
  }
}
