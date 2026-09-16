import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const studentAuthGuard: CanActivateFn = () => {

  const router = inject(Router);

  const token = localStorage.getItem('student_token');

  if (token) {
    return true;
  }

  return router.createUrlTree(['/student/login']);
};