import { Injectable } from '@angular/core';
import { map, Observable, Subject } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IDriverStanding, IRace, ITeamStanding } from '../../shared/types/api.types';

@Injectable({ providedIn: 'root' })
export class HomeService {
  public loading = new Subject<void>();

  constructor(private http: HttpClient) {}

  public getUpcomingRace(): Observable<IRace | null> {
    const params = new HttpParams()
      .set('race_status', 'upcoming')
      .set('count', 1)
      .set('circuit', true);
    return this.http
      .get<IRace[]>('http://localhost:3000/races/', { params })
      .pipe(map((races) => races[0] ?? null));
  }

  public getDriverStanding(): Observable<IDriverStanding[]> {
    return this.http.get<IDriverStanding[]>('http://localhost:3000/standings/drivers');
  }

  public getTeamStanding(): Observable<ITeamStanding[]> {
    return this.http.get<ITeamStanding[]>('http://localhost:3000/standings/team');
  }
}
