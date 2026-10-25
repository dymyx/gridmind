import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IDriverStanding, IRace, ITeamStanding } from '../../shared/types/api.types';

@Injectable({ providedIn: 'root' })
export class HomeService {
  public loading = new Subject<void>();

  constructor(private http: HttpClient) {}

  public getUpcomingRace(): Observable<IRace | null> {
    return this.http.get<IRace | null>('http://localhost:3000/races/upcoming');
  }

  public getDriverStanding(): Observable<IDriverStanding[]> {
    return this.http.get<IDriverStanding[]>('http://localhost:3000/standings/drivers');
  }

  public getTeamStanding(): Observable<ITeamStanding[]> {
    return this.http.get<ITeamStanding[]>('http://localhost:3000/standings/team');
  }
}
