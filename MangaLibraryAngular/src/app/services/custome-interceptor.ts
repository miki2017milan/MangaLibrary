import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  if (!token) return next(req);

  const request = req.clone({
    headers: req.headers.set('Authorization', 'Bearer ' + token),
  });

  return next(request).pipe(
    catchError((err) => {
      if (err.status === 401) {
        localStorage.removeItem('token');
        inject(Router).navigate(['/login']);
      }
      throw err;
    }),
  );
};
