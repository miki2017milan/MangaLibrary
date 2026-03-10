import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../services/account-service';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const accountService = inject(AccountService);

  if (accountService.isAuthenticated()) return true;

  return router.createUrlTree(['/login']);
};
