import { HttpClient, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../features/auth/auth.service';
import { isPublicAuthRequest } from './auth.interceptor';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401 || isPublicAuthRequest(req.url)) {
        return throwError(() => error);
      }

      return authService.refresh().pipe(
        catchError((refreshError) => {
          authService.clearToken();
          router.navigate(['/login']);
          return throwError(() => refreshError);
        }),
        switchMap(() => next(req)),
      );
    }),
  );
};
