import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IRace } from '../../types/api.types';
import { Observable, timer, map, of } from 'rxjs';

import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

@Component({
  selector: 'app-upcoming-race',
  standalone: false,
  templateUrl: './upcoming-race.component.html',
  styleUrl: './upcoming-race.component.scss',
})
export class UpcomingRaceComponent implements OnChanges {
  @Input() upcomingRace: IRace | null = null;
  public countdown$?: Observable<any>;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['upcomingRace']) {
      const date = this.upcomingRace?.raceDate;
      this.countdown$ = date ? timer(0, 1000).pipe(map(() => this.timer(date))) : of(null);
    }
  }

  private timer(date: string) {
    if (!date) return null;
    const diff = dayjs.duration(Math.max(dayjs(date).diff(dayjs()), 0));
    const predictClosed = diff.subtract(5, 'hours');

    return {
      days: diff.days(),
      hours: diff.hours(),
      minutes: diff.minutes(),
      seconds: diff.seconds(),
      predict: predictClosed.format('DD:HH:mm:ss'),
    };
  }
}
