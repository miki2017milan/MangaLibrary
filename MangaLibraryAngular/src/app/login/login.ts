import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AccountService } from '../services/account-service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  accountService = inject(AccountService);
  router = inject(Router);
  errorMessage = signal<string | undefined>(undefined);

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  submitLogin() {
    if (!this.form.valid) {
      return;
    }
    this.accountService
      .login(this.getEmail()?.value ?? '', this.getPassword()?.value ?? '')
      .subscribe({
        error: (err) => {
          this.errorMessage.set(err.error?.detail);
        },
      });
  }

  getEmail() {
    return this.form.get('email');
  }

  getPassword() {
    return this.form.get('password');
  }
}
