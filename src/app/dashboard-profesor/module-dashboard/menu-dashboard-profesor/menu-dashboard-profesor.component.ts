import { Component, OnDestroy, ChangeDetectorRef, OnInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { AuthService } from 'src/app/auth.service';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { SharedService } from 'src/app/shared.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ProfesoresService } from 'src/app/profesores.service';
import { AsignaturasDashboardProfesorComponent } from '../asignaturas-dashboard-profesor/asignaturas-dashboard-profesor.component';
import { HorarioDashboardProfesorComponent } from '../horario-dashboard-profesor/horario-dashboard-profesor.component';
import { NotasDashboardProfesorComponent } from '../notas-dashboard-profesor/notas-dashboard-profesor.component';
import { ProximosDashboardProfesorComponent } from '../proximos-dashboard-profesor/proximos-dashboard-profesor.component';

@Component({
  selector: 'app-menu-dashboard-profesor',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    RouterLink,
    RouterOutlet,
    CardModule,
    DividerModule,
    AsignaturasDashboardProfesorComponent,
    HorarioDashboardProfesorComponent,
    NotasDashboardProfesorComponent,
    ProximosDashboardProfesorComponent
  ],
  templateUrl: './menu-dashboard-profesor.component.html',
  styleUrls: ['./menu-dashboard-profesor.component.css']
})
export class MenuDashboardProfesorComponent implements OnInit, OnDestroy {

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
    private profesoresService: ProfesoresService,
    private router: Router
  ) {
    // Inicialización de media query
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    // Al iniciar el componente
    console.log('MenuDashboardProfesorComponent.ngOnInit');
    // Obtener datos de inicio de sesión
    const loginData = this.sharedService.getLoginData();
    console.log('MenuDashboardProfesortComponent.ngOnInit - loginData:', loginData);

    const rutProfesor = loginData.rut; // Rut del estudiante
    if (rutProfesor) {
      // Obtener datos del estudiante
      this.profesoresService.getDatosProfesor(rutProfesor).subscribe(
        (data) => {
          // Si hay datos
          if (data && data.length > 0) {
            this.username = data[0].nombres_str; // Mostrar nombre del estudiante
            // Llamar a obtenerAsignaturas con rut y idCurso
            this.obtenerAsignaturas(rutProfesor);
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

  obtenerAsignaturas(rut: string): void {
    // Método para obtener las asignaturas del estudiante
    this.profesoresService.resumeAsignaturas(rut).subscribe(
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

  isModuleSelected(): boolean {
    const routes = ['/dashboardteachers/asignatura/', '/dashboardteachers/eventos', '/dashboardteachers/observaciones', '/dashboardteachers/perfil'];
    return routes.some(route => this.router.url.includes(route));
  }

  isDashboardRoute(): boolean {
    // Obtenemos la ruta actual
    const currentRoute = this.router.url;
    // Verificamos si la ruta termina en "dashboardteachers"
    return currentRoute.endsWith('dashboardteachers');
  }

}
