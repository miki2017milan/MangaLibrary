import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AccountService } from '../services/account-service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
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
    this.accountService
      .login(this.loginForm.value.email ?? '', this.loginForm.value.password ?? '')
      .subscribe({
        error: (err) => {
          this.errorMessage.set(err.error?.detail);
        },
      });
  }
}
