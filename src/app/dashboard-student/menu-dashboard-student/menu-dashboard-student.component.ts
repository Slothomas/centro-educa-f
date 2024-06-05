import { Component, OnDestroy, ChangeDetectorRef, OnInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { AuthService } from 'src/app/auth.service';
import { MatListModule } from '@angular/material/list';
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
  ],
  templateUrl: './menu-dashboard-student.component.html',
  styleUrls: ['./menu-dashboard-student.component.css']
})
export class MenuDashboardStudentComponent implements OnInit, OnDestroy {
  username: string | null = null;
  mobileQuery: MediaQueryList;

  fillerNav = Array.from({ length: 5 }, (_, i) => `Nav Item ${i + 1}`);

  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private authService: AuthService,
    private sharedService: SharedService,
    private estudiantesService: EstudiantesService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    console.log('MenuDashboardStudentComponent.ngOnInit');
    const loginData = this.sharedService.getLoginData();
    console.log('MenuDashboardStudentComponent.ngOnInit - loginData:', loginData);

    const rutEstudiante = loginData.rut;
    if (rutEstudiante) {
      console.log('MenuDashboardStudentComponent.ngOnInit - calling getDatosEstudiante with RUT:', rutEstudiante);
      this.estudiantesService.getDatosEstudiante(rutEstudiante).subscribe(
        (data) => {
          console.log('MenuDashboardStudentComponent.ngOnInit - datos del estudiante:', data);
          if (data && data.length > 0) {
            this.username = data[0].nombres_str;
            console.log('MenuDashboardStudentComponent.ngOnInit - username set to:', this.username);
          }
        },
        (error) => {
          console.error('MenuDashboardStudentComponent.ngOnInit - error al obtener datos del estudiante:', error);
        }
      );
    } else {
      console.error('MenuDashboardStudentComponent.ngOnInit - RUT del estudiante no disponible');
    }
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  logout(): void {
    console.log('MenuDashboardStudentComponent.logout');
    this.authService.logout(); // Lógica para cerrar sesión
  }
}
