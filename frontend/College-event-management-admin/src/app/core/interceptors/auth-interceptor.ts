import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  let token: string | null = null;

  // Student API
  if (req.url.includes('/student/')) {
    token = localStorage.getItem('student_token');
  }

  // Coordinator API
  else if (req.url.includes('/coordinator/')) {
    token = localStorage.getItem('coordinator_token');
  }

  // Admin API
  else {
    token = localStorage.getItem('admin_token');
  }

  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
      }
    });

    return next(authReq);
  }

  return next(req);
};