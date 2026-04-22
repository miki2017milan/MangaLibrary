import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { UserDetails } from '../models/useretails.type';
import { RedirectService } from './redirect-service';
import { tap } from 'rxjs';
import { AuthenticationResponse as AuthenticationResponse } from '../models/AuthenticationResponse';
import { environment } from '../../enviroments/enviroment';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  accountUrl = environment.apiUrl + 'account/';

  http = inject(HttpClient);
  router = inject(Router);
  redireactService = inject(RedirectService);
  isAuthenticated = signal<boolean>(!!localStorage.getItem('token'));

  login(email: string, password: string) {
    return this.http
      .post<AuthenticationResponse>(this.accountUrl + 'login', { email, password })
      .pipe(
        tap((response) => {
          this.storeTokens(response);
        }),
      );
  }

  registerUser(email: string, password: string, displayName: string, confirmPassword: string) {
    return this.http
      .post<AuthenticationResponse>(this.accountUrl + 'register', {
        email,
        password,
        displayName,
        confirmPassword,
      })
      .pipe(
        tap((response) => {
          this.storeTokens(response);
        }),
      );
  }

  refreshToken() {
    return this.http
      .post<AuthenticationResponse>(this.accountUrl + 'refresh-token', {
        token: localStorage.getItem('token'),
        refreshToken: localStorage.getItem('refreshToken'),
      })
      .pipe(
        tap((response) => {
          this.storeTokens(response);
        }),
      );
  }

  getUserDetails() {
    return this.http.get<UserDetails>(this.accountUrl + 'profile');
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    this.isAuthenticated.set(false);
  }

  storeTokens(response: AuthenticationResponse) {
    localStorage.setItem('token', response.token);
    localStorage.setItem('refreshToken', response.refreshToken);
    this.isAuthenticated.set(true);
    this.router.navigateByUrl(this.redireactService.get());
  }
}
