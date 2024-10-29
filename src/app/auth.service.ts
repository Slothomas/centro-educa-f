import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap, catchError} from 'rxjs';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  private router = inject(Router);
  private http = inject(HttpClient);
  private sharedService = inject(SharedService);

  login(user: { rut_str: string; contrasena_str: string; idtiporol_int: number }): Observable<any> {
    console.log('AuthService.login - user:', user);
    return this.http.post('https://e2ac-172-206-232-198.ngrok-free.app/login/', user).pipe(
      tap((response: any) => {
        console.log('AuthService.login - response:', response);
        if (response && response.access_token) {
          this.doLoginUser(response.access_token, user.rut_str, user.idtiporol_int);
        } else {
          console.error('AuthService.login - Invalid login response');
          throw new Error('Invalid login response');
        }
      }),
      catchError(error => {
        console.error('AuthService.login - Error:', error);
        throw error; // Propagate the error to the caller
      })
    );
  }


  private doLoginUser(token: string, rut: string, idtiporol: number) {
    console.log('AuthService.doLoginUser - token:', token, 'rut:', rut, 'idtiporol:', idtiporol);
    this.storeJwtToken(token);
    this.sharedService.setLoginData(rut, idtiporol);
    this.isAuthenticatedSubject.next(true);
  }

  private storeJwtToken(token: string) {
    console.log('AuthService.storeJwtToken - token:', token);
    localStorage.setItem(this.JWT_TOKEN, token);
  }

  logout() {
    console.log('AuthService.logout');
    localStorage.removeItem(this.JWT_TOKEN);
    this.sharedService.clearLoginData();
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  isLoggedIn() {
    const tokenExists = !!localStorage.getItem(this.JWT_TOKEN);
    console.log('AuthService.isLoggedIn - tokenExists:', tokenExists);
    return tokenExists;
  }

  private hasToken(): boolean {
    const tokenExists = !!localStorage.getItem(this.JWT_TOKEN);
    console.log('AuthService.hasToken - tokenExists:', tokenExists);
    return tokenExists;
  }

  refreshToken() {
    const token = localStorage.getItem(this.JWT_TOKEN);
    console.log('AuthService.refreshToken - token:', token);
    if (!token) return;
    return this.http.post<any>('https://api.escuelajs.co/api/v1/auth/refresh-token', { token }).pipe(
      tap((response: any) => {
        console.log('AuthService.refreshToken - response:', response);
        this.storeJwtToken(response.access_token);
      })
    );
  }
}
