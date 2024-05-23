import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly USER_RUT = 'USER_RUT';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  private router = inject(Router);
  private http = inject(HttpClient);

  constructor() {}

  login(user: { rut_str: string; contrasena_str: string; idtiporol_int: number }): Observable<any> {
    return this.http.post('https://centro-educa-b.azurewebsites.net/login/', user).pipe(
      tap((response: any) => {
        this.doLoginUser(response.access_token, user.rut_str);
      })
    );
  }

  private doLoginUser(token: string, rut: string) {
    this.storeJwtToken(token);
    this.storeUserRut(rut);
    this.isAuthenticatedSubject.next(true);
  }

  private storeJwtToken(token: string) {
    localStorage.setItem(this.JWT_TOKEN, token);
  }

  private storeUserRut(rut: string) {
    localStorage.setItem(this.USER_RUT, rut);
  }

  logout() {
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem(this.USER_RUT);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  isLoggedIn() {
    return !!localStorage.getItem(this.JWT_TOKEN);
  }

  isTokenExpired() {
    const token = localStorage.getItem(this.JWT_TOKEN);
    if (!token) return true;
    const decoded: any = jwtDecode(token);
    if (!decoded.exp) return true;
    const expirationDate = decoded.exp * 1000;
    const now = new Date().getTime();
    return expirationDate < now;
  }

  getUserRut(): string | null {
    return localStorage.getItem(this.USER_RUT);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.JWT_TOKEN);
  }

  getCurrentAuthUser() {
    return this.http.get('https://api.escuelajs.co/api/v1/auth/profile');
  }
  refreshToken() {
    const token = localStorage.getItem(this.JWT_TOKEN);
    if (!token) return;
    return this.http.post<any>('https://api.escuelajs.co/api/v1/auth/refresh-token', { token }).pipe(
      tap((response: any) => this.storeJwtToken(response.access_token))
    );
  }
}
