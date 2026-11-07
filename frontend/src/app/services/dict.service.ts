import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { environment } from '../../environments/environment'
import { IDriverStanding, ITeamStanding, IUserSeasonStanding, IUsersGlobalStanding } from '../shared/types/api.types'

@Injectable({ providedIn: 'root' })
export class DictService {
  constructor(private http: HttpClient) {}

  /** Получаем зачет пилотов */
  public getDriverStanding(): Observable<IDriverStanding[]> {
    return this.http.get<IDriverStanding[]>(`${environment.api_url}/standings/drivers`);
  }

  /** Получаем зачет команд */
  public getTeamStanding(): Observable<ITeamStanding[]> {
    return this.http.get<ITeamStanding[]>(`${environment.api_url}/standings/team`);
  }

  /** Получаем зачет пользователей: глобальный */
  public getGlobalUserStanding(): Observable<IUsersGlobalStanding[]> {
    return this.http.get<IUsersGlobalStanding[]>(`${environment.api_url}/standings/users/global`);
  }

  /** Получаем зачет пользователей: за текущий сезон */
  public getSeasonUserStanding(): Observable<IUserSeasonStanding[]> {
    return this.http.get<IUserSeasonStanding[]>(`${environment.api_url}/standings/users/season`);
  }
}
