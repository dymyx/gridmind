import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../features/auth/auth.service';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.authService
      .isAuthenticatedUser()
      .pipe(map((isAuth) => isAuth || this.router.createUrlTree(['/login'])));
  }
}
