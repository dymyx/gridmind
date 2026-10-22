import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class HomeService {
  public loading = new Subject<void>();

  constructor(private http: HttpClient) {}

  public getUpcomingRace(): Observable<any> {
    return this.http.get('http://localhost:3000/races/upcoming');
  }
}
