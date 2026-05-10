import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../services/account-service';
import { RedirectService } from '../services/redirect-service';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const accountService = inject(AccountService);
  const redireactService = inject(RedirectService);

  if (accountService.isAuthenticated()) return true;

  redireactService.set('/library');
  return router.createUrlTree(['/login']);
};
