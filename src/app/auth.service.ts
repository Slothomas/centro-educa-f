import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly RUT_ESTUDIANTE = 'rutEstudiante_str';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  private router = inject(Router);
  private http = inject(HttpClient);

  login(user: { rut_str: string; contrasena_str: string; idtiporol_int: number }): Observable<any> {
    return this.http.post('https://centro-educa-back.azurewebsites.net/login/', user).pipe(
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
    localStorage.setItem(this.RUT_ESTUDIANTE, rut);
  }

  logout() {
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem(this.RUT_ESTUDIANTE);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  isLoggedIn() {
    return !!localStorage.getItem(this.JWT_TOKEN);
  }

  getUserRut(): string | null {
    return localStorage.getItem(this.RUT_ESTUDIANTE);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.JWT_TOKEN);
  }


  refreshToken() {
    const token = localStorage.getItem(this.JWT_TOKEN);
    if (!token) return;
    return this.http.post<any>('https://api.escuelajs.co/api/v1/auth/refresh-token', { token }).pipe(
      tap((response: any) => this.storeJwtToken(response.access_token))
    );
  }
}
