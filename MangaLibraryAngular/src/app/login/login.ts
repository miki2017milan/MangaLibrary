import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AccountService } from '../services/account-service';
import { catchError } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  accountService = inject(AccountService);
  router = inject(Router);
  errorMessage = signal<string | undefined>(undefined);

  submitLogin() {
    this.accountService.login(
      this.loginForm.value.email ?? '',
      this.loginForm.value.password ?? '',
    );
  }
}
