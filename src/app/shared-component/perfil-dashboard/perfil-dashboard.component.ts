import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/shared.service';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { FileUploadModule } from 'primeng/fileupload';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { timer } from 'rxjs';
import { DividerModule } from 'primeng/divider';


@Component({
  selector: 'app-perfil-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, PasswordModule, FileUploadModule, MatIconModule,
    ToastModule, ConfirmDialogModule, RouterLink,DividerModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './perfil-dashboard.component.html',
  styleUrls: ['./perfil-dashboard.component.css']
})


export class PerfilDashboardComponent implements OnInit {
  rutEstudiante: string = '';
  idtiporol: number = 0;
  datos: any = {};
  nuevaContrasena: string = '';
  confirmarContrasena: string = '';

  isProfileChanged: boolean = false;
  isPasswordChanged: boolean = false;

  originalCorreo: string = '';
  originalTelefono: string = '';

  constructor(
    private sharedService: SharedService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.obtenerDatosEstudiante();
  }

  obtenerDatosEstudiante(): void {
    this.sharedService.getEstudianteData().subscribe(estudiante => {
      if (estudiante) {
        this.rutEstudiante = estudiante.rut_str;
        this.obtenerPerfil();
      } else {
        console.error('El rut del estudiante no está disponible.');
      }
    });
  }

  obtenerPerfil(): void {
    if (this.rutEstudiante) {
      const loginData = this.sharedService.getLoginData();
      if (loginData.idtiporol !== null) {
        this.idtiporol = loginData.idtiporol;
        this.sharedService.obtenerPerfil(this.rutEstudiante, this.idtiporol).subscribe(
          (data: any) => {
            this.datos = data;
            this.originalCorreo = data.Correo;
            this.originalTelefono = data.Telefono;
            this.checkFormChanges();
          },
          error => {
            console.error('Error al obtener los datos:', error);
          }
        );
      } else {
        console.error('El idtiporol es null.');
      }
    }
  }

  checkFormChanges(): void {
    const correoValido = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(this.datos.Correo);
    const telefonoValido = /^\+569\d{8}$/.test(this.datos.Telefono);
    const correoChanged = this.datos.Correo !== this.originalCorreo;
    const telefonoChanged = this.datos.Telefono !== this.originalTelefono;
    const contrasenasCoinciden = this.nuevaContrasena === this.confirmarContrasena;

    this.isProfileChanged = correoValido && telefonoValido && (correoChanged || telefonoChanged);
    this.isPasswordChanged = contrasenasCoinciden && (!!this.nuevaContrasena || !!this.confirmarContrasena);
  }

  confirmDatos(event: Event): void {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que quieres actualizar tus datos de perfil?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon:"none",
      rejectIcon:"none",
      rejectButtonStyleClass:"p-button-text",
      accept: () => {
        this.actualizarPerfil();
      },
      reject: () => {
        // Acciones a realizar si se rechaza la confirmación
      }
    });
  }

  confirmClave(event: Event): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: '¿Estás seguro que quieres actualizar tu clave?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon:"none",
      rejectIcon:"none",
      rejectButtonStyleClass:"p-button-text",
      accept: () => {
        this.actualizarContrasena();
      },
      reject: () => {
        // Acciones a realizar si se rechaza la confirmación
      }
    });
  }

  actualizarPerfil(): void {
    let nuevoCorreo = this.datos.Correo !== this.originalCorreo ? this.datos.Correo : null;
    let nuevoTelefono = this.datos.Telefono !== this.originalTelefono ? this.datos.Telefono : null;

    this.sharedService.actualizarDatos(this.rutEstudiante, this.idtiporol, nuevoCorreo, nuevoTelefono).subscribe(
      response => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Datos actualizados correctamente' });
        // Espera 5 segundos antes de recargar la página
        timer(3000).subscribe(() => {
          this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          this.router.onSameUrlNavigation = 'reload';
          this.router.navigate(['.'], { relativeTo: this.route });
        });
      },
      error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar los datos' });
        console.error('Error al actualizar los datos', error);
      }
    );
  }

  actualizarContrasena(): void {
    if (this.nuevaContrasena !== this.confirmarContrasena) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Las contraseñas no coinciden.' });
      return;
    }

    this.sharedService.actualizarClave(this.rutEstudiante, this.nuevaContrasena).subscribe(
      response => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Contraseña actualizada correctamente' });
        // Espera 5 segundos antes de recargar la página
        timer(5000).subscribe(() => {
          this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          this.router.onSameUrlNavigation = 'reload';
          this.router.navigate(['.'], { relativeTo: this.route });
        });
      },
      error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar la contraseña' });
        console.error('Error al actualizar la contraseña', error);
      }
    );
  }
}
