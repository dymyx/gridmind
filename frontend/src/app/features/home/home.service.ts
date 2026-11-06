import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subject } from 'rxjs';
import {
  IDriverStanding,
  IRace,
  IRaceResult,
  ITeamStanding,
  IUserPrediction,
  IUsersGlobalStanding,
} from '../../shared/types/api.types';

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

  public getLastRace(): Observable<IRaceResult> {
    return this.http.get<IRaceResult>('http://localhost:3000/races/results');
  }

  public getPredictionByRace(race_id: string): Observable<IUserPrediction | null> {
    const params = new HttpParams().set('race_id', race_id).set('count', 1);
    return this.http
      .get<IUserPrediction[]>('http://localhost:3000/predictions/user', { params })
      .pipe(map((predictions) => predictions[0] ?? null));
  }

  public getDriverStanding(): Observable<IDriverStanding[]> {
    return this.http.get<IDriverStanding[]>('http://localhost:3000/standings/drivers');
  }

  public getTeamStanding(): Observable<ITeamStanding[]> {
    return this.http.get<ITeamStanding[]>('http://localhost:3000/standings/team');
  }

  public getGlobalStanding(): Observable<IUsersGlobalStanding[]> {
    return this.http.get<IUsersGlobalStanding[]>('http://localhost:3000/standings/users/global');
  }

  public setPrediction(data: any): Observable<any> {
    return this.http.post<any>('http://localhost:3000/predictions/create', data);
  }

  public canPredict(race_id: string): Observable<boolean> {
    const params = new HttpParams().set('race_id', race_id);
    return this.http.get<boolean>('http://localhost:3000/predictions/can', { params });
  }
}
