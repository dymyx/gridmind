import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IRace } from '../../shared/types/api.types';

@Injectable({ providedIn: 'root' })
export class ScheduleService {
  public loading = new Subject<void>();

  constructor(private http: HttpClient) {}

  public getRaceById(id: string): Observable<IRace | null> {
    const params = new HttpParams()
      .set('count', 1) // кол-во - 1
      .set('race_id', id) // конкретная гонка
      .set('circuit', true) // данные по треку
      .set('qualifying', true) // данные по квалификации
      .set('qualifying_count', 5); // кол-во пилотов по квалификации

    return this.http
      .get<IRace[]>(`${environment.api_url}/races/`, { params })
      .pipe(map((races) => races[0] ?? null));
  }
}
