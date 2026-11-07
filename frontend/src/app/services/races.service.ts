import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { map, Observable } from 'rxjs'
import { environment } from '../../environments/environment'
import { IRace, IRaceResult } from '../shared/types/api.types'

@Injectable({ providedIn: 'root' })
export class RacesService {
  constructor(private http: HttpClient) {}

  /** Получение предстоящей гонки */
  public getUpcomingRace(): Observable<IRace | null> {
    const params = new HttpParams()
      .set('race_status', 'upcoming') // Статус гонки - предстоит
      .set('count', 1) // Кол-во гонок - 1
      .set('circuit', true); // включать данные по треку - да

    return this.http
      .get<IRace[]>(`${environment.api_url}/races/`, { params })
      .pipe(map((races) => races[0] ?? null));
  }

  /**
   * Получение всех гонок
   * @param year - если передан параметр ищем за указанный год
   * @returns
   */
  public getAllRaces(year?: number): Observable<IRace[]> {
    let params = new HttpParams();
    if (year) params = params.set('year', year);

    return this.http.get<IRace[]>(`${environment.api_url}/races/`, { params });
  }

  // #RACE_RESULTS --------------------------

  /**
   * Получение результатов гонки.
   * Если передан параметр id - показываем результаты конкретной гонки.
   * Не передан - последнюю.
   * @param id - race_id
   * @returns
   */
  public getRaceResult(id?: string): Observable<IRaceResult> {
    let params = new HttpParams();
    if (id) params = params.set('race_id', id);

    return this.http.get<IRaceResult>(`${environment.api_url}/races/results`, { params });
  }
}
