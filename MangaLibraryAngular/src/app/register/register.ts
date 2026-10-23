import { Component, inject, OnInit, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AccountService } from '../services/account-service';
import { catchError, EMPTY } from 'rxjs';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register implements OnInit {
  accountService = inject(AccountService);
  errorMessage = signal('');
  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  passwordMatchValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const password = group.get('password')?.value;
      const confirmPassword = group.get('confirmPassword')?.value;

      return password === confirmPassword ? null : { passwordMismatch: true };
    };
  }

  passwordRequiresNonAlphanumericValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value: string = control.value ?? '';
    if (!value) return null; // let Validators.required handle empty

    return /[^a-zA-Z0-9]/.test(value) ? null : { requiresNonAlphanumeric: true };
  };
}

passwordRequiresLowercaseValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value: string = control.value ?? '';
    if (!value) return null;

    return /[a-z]/.test(value) ? null : { requiresLowercase: true };
  };
}

passwordRequiresUppercaseValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value: string = control.value ?? '';
    if (!value) return null;

    return /[A-Z]/.test(value) ? null : { requiresUppercase: true };
  };
}

  ngOnInit(): void {
    this.form = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email, Validators.maxLength(256)]],
        displayName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(32)]],
        password: ['', 
          [
            Validators.required, 
            Validators.minLength(8),
            this.passwordRequiresNonAlphanumericValidator(),
            this.passwordRequiresLowercaseValidator(),
            this.passwordRequiresUppercaseValidator(),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator() },
    );
  }

  getEmail() {
    return this.form.get('email');
  }

  getPassword() {
    return this.form.get('password');
  }

  getConfirmPassword() {
    return this.form.get('confirmPassword');
  }

  getDisplayName() {
    return this.form.get('displayName');
  }

  submitRegister() {
    if (!this.form.valid) {
      return;
    }

    this.accountService
      .registerUser(
        this.getEmail()?.value,
        this.getPassword()?.value,
        this.getDisplayName()?.value,
        this.getConfirmPassword()?.value,
      )
      .pipe(
        catchError((err) => {
          if (err.error?.[0]?.code === 'DuplicateUserName') {
            this.errorMessage.set('Email already taken');
          }
          return EMPTY;
        }),
      )
      .subscribe();
  }
}
