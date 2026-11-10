
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { StudentAuthService } from '../services/student-auth';

export const studentAuthGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(StudentAuthService);

  const token = localStorage.getItem('student_token');
  const studentData = localStorage.getItem('student');

  if (
    !token ||
    token === 'undefined' ||
    token === 'null' ||
    !studentData ||
    studentData === 'undefined' ||
    studentData === 'null'
  ) {
    localStorage.removeItem('student_token');
    localStorage.removeItem('student');

    return router.createUrlTree(['/student/login']);
  }

  try {
    const student = JSON.parse(studentData);

    if (!student || typeof student !== 'object' || Array.isArray(student)) {
      throw new Error('Invalid student data');
    }
  } catch {
    localStorage.removeItem('student_token');
    localStorage.removeItem('student');

    return router.createUrlTree(['/student/login']);
  }

  // Verify token with Laravel Sanctum
  return authService.getProfile().pipe(
    map((response: any) => {
      if (!response || !response.student && !response.id) {
        localStorage.removeItem('student_token');
        localStorage.removeItem('student');
        return router.createUrlTree(['/student/login']);
      }

      return true;
    }),
    catchError(() => {
      localStorage.removeItem('student_token');
      localStorage.removeItem('student');

      return of(router.createUrlTree(['/student/login']));
    })
  );
};
