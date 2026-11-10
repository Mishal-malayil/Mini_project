
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const studentAuthGuard: CanActivateFn = () => {

  const router = inject(Router);

  const token = localStorage.getItem('student_token');
  const studentData = localStorage.getItem('student');

  // Validate token
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

  // Validate student JSON
  try {
    const student = JSON.parse(studentData);

    if (!student || typeof student !== 'object') {
      throw new Error('Invalid student data');
    }

    return true;

  } catch (error) {
    localStorage.removeItem('student_token');
    localStorage.removeItem('student');

    return router.createUrlTree(['/student/login']);
  }
};
