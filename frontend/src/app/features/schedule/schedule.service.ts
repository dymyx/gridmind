import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subject } from 'rxjs';
import { IRace, ITopPredictions, IUserPrediction } from '../../shared/types/api.types';

@Injectable({ providedIn: 'root' })
export class ScheduleService {
  public loading = new Subject<void>();

  constructor(private http: HttpClient) {}

  public getAllRaces(): Observable<IRace[]> {
    return this.http.get<IRace[]>('http://localhost:3000/races/');
  }

  public getRaceById(id: string): Observable<IRace | null> {
    const params = new HttpParams()
      .set('count', 1)
      .set('race_id', id)
      .set('circuit', true)
      .set('qualifying', true)
      .set('qualifying_count', 5);
    return this.http
      .get<IRace[]>(`http://localhost:3000/races/`, { params })
      .pipe(map((races) => races[0] ?? null));
  }

  public getRaceResultsById(id: string): Observable<any> {
    const params = new HttpParams().set('id', id);
    return this.http.get<any>('http://localhost:3000/races/results', { params });
  }

  public getTopPredicts(race_id: string, count?: number): Observable<ITopPredictions[]> {
    const params = new HttpParams();
    if (count) {
      params.set('count', count);
    }
    return this.http.get<ITopPredictions[]>(`http://localhost:3000/predictions/top/${race_id}`, {
      params,
    });
  }

  public getUserRacePredict(race_id: string): Observable<IUserPrediction[]> {
    const params = new HttpParams().set('race_id', race_id);

    return this.http.get<IUserPrediction[]>('http://localhost:3000/predictions/user', { params });
  }
}
