import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, EMPTY } from 'rxjs';
import { AccountService } from './account-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  if (!token) return next(req);

  const request = req.clone({
    headers: req.headers.set('Authorization', 'Bearer ' + token),
  });

  const router = inject(Router);
  const accountService = inject(AccountService);

  return next(request).pipe(
    catchError((err) => {
      if (err.status === 401) {
        accountService.logout();
        router.navigateByUrl('/');
        return EMPTY;
      }
      throw err;
    }),
  );
};
