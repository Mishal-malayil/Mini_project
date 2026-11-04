import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  let token: string | null = null;

  if (req.url.includes('/student/')) {
    token = localStorage.getItem('student_token');
  } else if (req.url.includes('/coordinator/')) {
    token = localStorage.getItem('coordinator_token');
  } else {
    token = localStorage.getItem('admin_token');
  }

  // Ignore missing or invalid tokens
  if (!token || token === 'undefined' || token === 'null') {
    console.warn('No valid auth token found for:', req.url);
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json'
    }
  });

  return next(authReq);
};