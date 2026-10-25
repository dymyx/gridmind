import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IRace } from '../../shared/types/api.types';

@Injectable({ providedIn: 'root' })
export class ScheduleService {
  public loading = new Subject<void>();

  constructor(private http: HttpClient) {}

  public getAllRaces(): Observable<IRace[]> {
    return this.http.get<IRace[]>('http://localhost:3000/races/');
  }

  public getRaceById(id: string): Observable<any> {
    return this.http.get<any>(`http://localhost:3000/races/${id}`);
  }

  public getRaceResultsById(id: string): Observable<any> {
    const params = new HttpParams().set('id', id);
    return this.http.get<any>('http://localhost:3000/races/results', { params });
  }
}
