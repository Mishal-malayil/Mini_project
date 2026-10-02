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


  console.log('AUTH INTERCEPTOR:', {
    url: req.url,
    tokenType: req.url.includes('/student/')
      ? 'student_token'
      : req.url.includes('/coordinator/')
        ? 'coordinator_token'
        : 'admin_token',
    hasToken: !!token
  });


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