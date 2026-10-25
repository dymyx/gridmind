import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, finalize, map, Observable, of, shareReplay, tap } from 'rxjs';
import {
  IAuthResponse,
  IDriver,
  ILoginDto,
  IRegisterDto,
  ITeam,
} from '../../shared/types/api.types';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private token$ = new BehaviorSubject<string>('');
  private refreshRequest$: Observable<string> | null = null;

  constructor(private http: HttpClient) {}

  public getAccesToken() {
    return this.token$.value;
  }

  public clearToken() {
    this.token$.next('');
  }

  public refresh(): Observable<string> {
    if (!this.refreshRequest$) {
      this.refreshRequest$ = this.http
        .post<IAuthResponse>('http://localhost:3000/auth/refresh', {}, { withCredentials: true })
        .pipe(
          map((res) => res.accessToken),
          tap((token) => this.token$.next(token)),
          finalize(() => (this.refreshRequest$ = null)),
          shareReplay(1),
        );
    }
    return this.refreshRequest$;
  }

  public isAuthenticatedUser(): Observable<boolean> {
    if (this.token$.value) return of(true);

    return this.refresh().pipe(
      map(() => true),
      catchError(() => of(false)),
    );
  }

  public loginUser(data: ILoginDto): Observable<any> {
    return this.http
      .post<IAuthResponse>('http://localhost:3000/auth/login', data, {
        withCredentials: true,
      })
      .pipe(tap((res) => this.token$.next(res.accessToken)));
  }

  public registerUser(data: IRegisterDto): Observable<any> {
    return this.http
      .post<IAuthResponse>('http://localhost:3000/auth/register', data, {
        withCredentials: true,
      })
      .pipe(tap((res) => this.token$.next(res.accessToken)));
  }

  public isUsernameAvailable(username: string): Observable<boolean> {
    return this.http
      .get<{ available: boolean }>('http://localhost:3000/auth/username-available', {
        params: { username },
      })
      .pipe(map((res) => res.available));
  }

  public logout(): Observable<any> {
    this.token$.next('');
    return this.http.post('http://localhost:3000/auth/logout', {}, { withCredentials: true });
  }

  // # DICTIONARIES

  public getAllTeams(): Observable<ITeam[]> {
    return this.http.get<ITeam[]>('http://localhost:3000/dict/teams');
  }
  public getAllDrivers(): Observable<IDriver[]> {
    return this.http.get<IDriver[]>('http://localhost:3000/dict/drivers');
  }
}
