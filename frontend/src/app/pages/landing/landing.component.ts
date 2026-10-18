import { Component } from '@angular/core';

@Component({
  selector: 'app-landing',
  standalone: false,
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent {
  stats = [
    { value: 24, label: 'Races' },
    { value: 22, label: 'Drivers' },
    { value: 1, label: 'Champion' },
  ];

  podium = [
    { position: 1, name: 'Verstappen', number: 3, color: '#191fb5' },
    { position: 2, name: 'Leclerc', number: 16, color: '#cc2c29' },
    { position: 3, name: 'Antonelli', number: 12, color: '#29ccc7' },
  ];
}
