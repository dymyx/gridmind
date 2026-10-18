import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../features/auth/auth.service';

export const isPublicAuthRequest = (url: string) => /\/auth\/(login|register|refresh)$/.test(url);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).getAccesToken();

  if (!token || isPublicAuthRequest(req.url)) return next(req);

  return next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
};
