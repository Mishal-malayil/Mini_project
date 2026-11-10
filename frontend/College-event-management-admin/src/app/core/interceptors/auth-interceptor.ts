
import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const url = req.url;

  let token: string | null = null;

  if (url.includes('/api/student/')) {
    token = localStorage.getItem('student_token');
  } else if (url.includes('/api/coordinator/')) {
    token = localStorage.getItem('coordinator_token');
  } else if (url.includes('/api/admin/')) {
    token = localStorage.getItem('admin_token');
  }

  // Public API or missing token
  if (!token || token === 'undefined' || token === 'null') {
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
