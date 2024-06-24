import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { SharedService } from '../shared.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  rut_str = '';
  contrasena_str = '';
  idtiporol_int: any;
  authService = inject(AuthService);
  sharedService = inject(SharedService);
  router = inject(Router);

  login(event: Event) {
    event.preventDefault();
    const idtiporol_int = parseInt(this.idtiporol_int); // Convertir a número entero
    console.log('LoginComponent.login - rut_str:', this.rut_str, 'contrasena_str:', this.contrasena_str, 'idtiporol_int:', idtiporol_int);
    this.authService
      .login({
        rut_str: this.rut_str,
        contrasena_str: this.contrasena_str,
        idtiporol_int: idtiporol_int,
      })
      .pipe(
        catchError((error) => {
          console.error('LoginComponent.login - error:', error);
          alert('Usuario o clave incorrecta');
          return of(null);
        })
      )
      .subscribe((response) => {
        if (response) {
          console.log('LoginComponent.login - success, response:', response);
          this.sharedService.setLoginData(this.rut_str, idtiporol_int);

          // Redirigir basado en el rol del usuario
          if (idtiporol_int === 2) {
            this.router.navigate(['/dashboardteachers']);
          } else if (idtiporol_int === 3) {
            this.router.navigate(['/dashboardstudents']);
          } }
      });
  }
}
