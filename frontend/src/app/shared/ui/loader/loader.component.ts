import { Component } from '@angular/core';
import { map, timer } from 'rxjs';

@Component({
  selector: 'app-loader',
  standalone: false,
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss',
})
export class LoaderComponent {
  public lights = [0, 1, 2, 3, 4];
  private phrases = [
    'Radio check...',
    'Analyze data...',
    'Tu Tu Tu ...',
    'Lights out...',
    'Setup bolid...',
    "It's HAMMERTIME...",
    'We are checking...',
    'Ah-bwa-bla-ggh... button... [robot sounds]',
  ];

  public phrase = this.phrases[Math.floor(Math.random() * this.phrases.length)];

  public lit$ = timer(0, 700).pipe(map((n) => n % 7));
}
