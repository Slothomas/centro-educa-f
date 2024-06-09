import { Component, OnDestroy, ChangeDetectorRef, OnInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { AuthService } from 'src/app/auth.service';
import { MatListModule, MatNavList } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { AsignaturasDashboardStudentComponent } from '../asignaturas-dashboard-student/asignaturas-dashboard-student.component';
import { SharedService } from 'src/app/shared.service';
import { EstudiantesService } from 'src/app/estudiantes.service';
import { NotasDashboardStudentComponent } from '../notas-dashboard-student/notas-dashboard-student.component';
import { ProximosDashboardStudentComponent } from '../proximos-dashboard-student/proximos-dashboard-student.component';
import { HorarioDashboardStudentComponent } from '../horario-dashboard-student/horario-dashboard-student.component';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-menu-dashboard-student',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    AsignaturasDashboardStudentComponent,
    NotasDashboardStudentComponent,
    ProximosDashboardStudentComponent,
    HorarioDashboardStudentComponent,
    RouterLink,
    RouterOutlet
  ],
  templateUrl: './menu-dashboard-student.component.html',
  styleUrls: ['./menu-dashboard-student.component.css']
})

export class MenuDashboardStudentComponent implements OnInit, OnDestroy {
  username: string | null = null; // Nombre del estudiante
  mobileQuery: MediaQueryList; // Media query para detectar dispositivos móviles
  asignaturas: any[] = []; // Lista de asignaturas
  asignaturasMenuOpened = false; // Estado del menú de asignaturas (abierto/cerrado)

  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private authService: AuthService,
    private sharedService: SharedService,
    private estudiantesService: EstudiantesService,
    private router: Router
  ) {
    // Inicialización de media query
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    // Al iniciar el componente
    console.log('MenuDashboardStudentComponent.ngOnInit');
    // Obtener datos de inicio de sesión
    const loginData = this.sharedService.getLoginData();
    console.log('MenuDashboardStudentComponent.ngOnInit - loginData:', loginData);

    const rutEstudiante = loginData.rut; // Rut del estudiante
    if (rutEstudiante) {
      // Obtener datos del estudiante
      this.estudiantesService.getDatosEstudiante(rutEstudiante).subscribe(
        (data) => {
          // Si hay datos
          if (data && data.length > 0) {
            this.username = data[0].nombres_str; // Mostrar nombre del estudiante
            const idCurso = data[0].idCurso_int; // Obtener ID del curso
            // Llamar a obtenerAsignaturas con rut y idCurso
            this.obtenerAsignaturas(rutEstudiante, idCurso);
          }
        },
        (error) => {
          console.error('Error al obtener datos del estudiante:', error);
        }
      );
    } else {
      console.error('RUT del estudiante no disponible');
    }
  }

  ngOnDestroy(): void {
    // Al destruir el componente, remover el listener de la media query
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  logout(): void {
    // Método para cerrar sesión
    console.log('Logout');
    this.authService.logout(); // Lógica para cerrar sesión
  }

  obtenerAsignaturas(rut: string, idCurso: number): void {
    // Método para obtener las asignaturas del estudiante
    this.estudiantesService.obtenerAsignaturas(rut, idCurso).subscribe(
      (asignaturas) => {
        // Actualizar las asignaturas en la variable local
        this.asignaturas = asignaturas;
      },
      (error) => {
        console.error('Error al obtener asignaturas:', error);
      }
    );
  }

  toggleAsignaturasMenu(): void {
    // Método para alternar el estado del menú de asignaturas (abierto/cerrado)
    this.asignaturasMenuOpened = !this.asignaturasMenuOpened;
  }

  isAsignaturaSelected(): boolean {
    // Método para verificar si la página actual corresponde a una asignatura seleccionada
    return this.router.url.includes('/dashboardstudents/asignatura/');
  }
}
