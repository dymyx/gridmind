import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { map, Observable } from 'rxjs'
import { environment } from '../../environments/environment'
import { ITopPredictions, IUserPrediction } from '../shared/types/api.types'

@Injectable({ providedIn: 'root' })
export class PredictionsService {
  constructor(private http: HttpClient) {}

  /**
   * Получение предикта пользователя за гонку
   * @param race_id - ID гонки
   * @returns
   */
  public getUserPredictionByRace(race_id: string): Observable<IUserPrediction | null> {
    const params = new HttpParams().set('race_id', race_id).set('count', 1);

    return this.http
      .get<IUserPrediction[]>(`${environment.api_url}/predictions/user`, { params })
      .pipe(map((predictions) => predictions[0] ?? null));
  }

  /**
   * Создание предикта
   * @param data - данные для предикта
   */
  public setPrediction(data: any): Observable<any> {
    return this.http.post<any>(`${environment.api_url}/predictions/create`, data);
  }

  /**
   * Может ли пользователь сделать предикт на гонку
   * @param race_id - ID гонка
   * @returns
   */
  public canPredict(race_id: string): Observable<boolean> {
    const params = new HttpParams().set('race_id', race_id);

    return this.http.get<boolean>(`${environment.api_url}/predictions/can`, { params });
  }

  /**
   * Получаем топ n предиктов за указанную гонку.
   * По умолчанию count = 5
   * @param race_id - ID гонки
   * @param count - кол-во предиктов
   * @returns
   */
  public getTopPredicts(race_id: string, count: number = 5): Observable<ITopPredictions[]> {
    const params = new HttpParams().set('count', count);

    return this.http.get<ITopPredictions[]>(`${environment.api_url}/predictions/top/${race_id}`, {
      params,
    });
  }
}
