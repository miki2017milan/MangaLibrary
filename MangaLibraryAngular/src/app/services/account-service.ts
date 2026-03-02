import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs';
import { UserDetails } from '../models/useretails.type';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  url = 'http://localhost:5050/api/account/';

  http = inject(HttpClient);
  router = inject(Router);
  isAuthenticated = signal<boolean>(!!localStorage.getItem('token'));
  userId = signal<string | null>(null);

  login(email: string, password: string) {
    this.http
      .post<{ token: string; expiration: string }>(this.url + 'login', { email, password })
      .pipe(
        catchError((err) => {
          throw err;
        }),
      )
      .subscribe((response) => {
        localStorage.setItem('token', response.token);
        this.isAuthenticated.set(true);
        this.userId.set(this.getUserId());
        this.router.navigateByUrl('/');
      });
  }

  private getUserId(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub ?? null;
    } catch {
      return null;
    }
  }

  getUserDetails() {
    return this.http.get<UserDetails>(this.url + 'profile');
  }

  logout() {
    localStorage.setItem('token', '');
    this.userId.set(null);
    this.isAuthenticated.set(false);
  }
}
