import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../modules/auth/services/auth';

export const adminGuard: CanActivateFn = (route, state) => {
  var authService = inject(Auth)
  if (!authService.isAdmin()) {
    var router = inject(Router);
    router.navigate(['/auth']);
    return false;
  }
  return true;
};
