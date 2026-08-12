import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const router = inject(Router);

  const token = localStorage.getItem('token');

  // Add JWT token
  if (token) {

    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

  }

  return next(req).pipe(

    catchError((error: HttpErrorResponse) => {

      // =====================================
      // 401 UNAUTHORIZED
      // =====================================

      if (error.status === 401) {

        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');

        router.navigate(['/401']);

      }


      // =====================================
      // 500 SERVER ERROR
      // =====================================

      else if (error.status === 500) {

        router.navigate(['/500']);

      }


      // Pass error to the original caller
      return throwError(() => error);

    })

  );

};
