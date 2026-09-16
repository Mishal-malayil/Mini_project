import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const coordinatorAuthGuard: CanActivateFn = () => {
  const router = inject(Router);

  const token = localStorage.getItem('coordinator_token');

  if (token && token.trim() !== '') {
    return true;
  }

  return router.createUrlTree(['/coordinator/login']);
};