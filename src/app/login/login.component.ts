import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
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
  router = inject(Router);

  login(event: Event) {
    event.preventDefault();
    const idtiporol_int = parseInt(this.idtiporol_int); // Convertir a número entero
    console.log(`Login: ${this.rut_str} / ${this.contrasena_str} / ${typeof idtiporol_int}`);
    this.authService
      .login({
        rut_str: this.rut_str,
        contrasena_str: this.contrasena_str,
        idtiporol_int: idtiporol_int,
      })
      .pipe(
        catchError((error) => {
          // Aquí puedes manejar el error, por ejemplo, mostrando una alerta
          alert('Usuario o clave incorrecta');
          // Retorna un observable vacío para que el flujo continue
          return of(null);
        })
      )
      .subscribe((response) => {
        if (response) {
          alert('Login success!');
          this.router.navigate(['/dashboardstudents']);
        }
      });
  }
}
