import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IRace } from '../../shared/types/api.types';

@Injectable({ providedIn: 'root' })
export class ResultService {
  public loading = new Subject<void>();

  constructor(private http: HttpClient) {}

  public getLastRaces(): Observable<IRace[]> {
    const params = new HttpParams().set('count', 5);
    return this.http.get<IRace[]>('http://localhost:3000/races/last', { params });
  }
}
