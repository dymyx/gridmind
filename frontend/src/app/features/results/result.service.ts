import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IRace } from '../../shared/types/api.types';

@Injectable({ providedIn: 'root' })
export class ResultService {
  public loading = new Subject<void>();

  constructor(private http: HttpClient) {}

  public getLastRaces(): Observable<IRace[]> {
    const params = new HttpParams()
      .set('count', 5)
      .set('order', 'desc')
      .set('qualifying', true)
      .set('race_status', 'finished');
    return this.http.get<IRace[]>(`${environment.api_url}/races/`, { params });
  }
}
