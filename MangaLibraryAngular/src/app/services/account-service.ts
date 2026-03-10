import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { UserDetails } from '../models/useretails.type';
import { RedirectService } from './redirect-service';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  accountUrl = 'http://192.168.0.47:5050/api/account/';

  http = inject(HttpClient);
  router = inject(Router);
  redireactService = inject(RedirectService);
  isAuthenticated = signal<boolean>(!!localStorage.getItem('token'));

  login(email: string, password: string) {
    return this.http
      .post<{ token: string; expiration: string }>(this.accountUrl + 'login', { email, password })
      .pipe(
        tap((response) => {
          localStorage.setItem('token', response.token);
          this.isAuthenticated.set(true);
          this.router.navigateByUrl(this.redireactService.get());
        }),
      );
  }

  getUserDetails() {
    return this.http.get<UserDetails>(this.accountUrl + 'profile');
  }

  logout() {
    localStorage.removeItem('token');
    this.isAuthenticated.set(false);
  }
}
