import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const jwtToken = getJwtToken();
  if (jwtToken) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });
    return next(cloned);
  }
  // Si el token no está presente, simplemente pasamos la solicitud sin modificarla
  return next(req);
};



function getJwtToken(): string | null {
  return localStorage.getItem('JWT_TOKEN');
}

