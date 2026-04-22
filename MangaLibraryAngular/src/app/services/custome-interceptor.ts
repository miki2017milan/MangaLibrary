import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, EMPTY, filter, switchMap, take, throwError } from 'rxjs';
import { AccountService } from './account-service';

var isRefreshing = false;
const refreshingSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  if (!token) return next(req);

  if (req.url.includes('refresh-token')) {
    return next(req);
  }

  const authRequest = addToken(req, token);

  const router = inject(Router);
  const accountService = inject(AccountService);

  return next(authRequest).pipe(
    catchError((err) => {
      if (err instanceof HttpErrorResponse && err.status === 401) {
        console.log('handeling 401');
        return handle401(req, next, accountService, router);
      }
      throw throwError(() => err);
    }),
  );
};

const addToken = (req: HttpRequest<unknown>, token: string) => {
  return req.clone({
    headers: req.headers.set('Authorization', 'Bearer ' + token),
  });
};

const handle401 = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  accountService: AccountService,
  router: Router,
) => {
  console.log(isRefreshing);
  if (!isRefreshing) {
    console.log('refreshing');
    isRefreshing = true;
    refreshingSubject.next(null);
    return accountService.refreshToken().pipe(
      switchMap((response) => {
        console.log(response);
        isRefreshing = false;
        accountService.storeTokens(response);
        refreshingSubject.next(response.token);
        return next(addToken(req, response.token));
      }),
      catchError((err) => {
        isRefreshing = false;
        accountService.logout();
        router.navigate(['/']);
        return throwError(() => err);
      }),
    );
  }

  return refreshingSubject.pipe(
    filter((token) => token !== null),
    take(1),
    switchMap((token) => {
      return next(addToken(req, token));
    }),
  );
};
