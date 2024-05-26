import { Component, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { AuthService } from 'src/app/auth.service';
import { NavbarDashboardStudentComponent } from '../navbar-dashboard-student/navbar-dashboard-student.component';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { AsignaturasDashboardStudentComponent } from '../asignaturas-dashboard-student/asignaturas-dashboard-student.component';

@Component({
  selector: 'app-menu-dashboard-student',
  standalone: true,
  imports: [
    CommonModule,
    NavbarDashboardStudentComponent,
    MatListModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    AsignaturasDashboardStudentComponent,
  ],
  templateUrl: './menu-dashboard-student.component.html',
  styleUrls: ['./menu-dashboard-student.component.css']
})
export class MenuDashboardStudentComponent implements OnDestroy {
  username: string | null = null;
  mobileQuery: MediaQueryList;

  fillerNav = Array.from({ length: 5 }, (_, i) => `Nav Item ${i + 1}`);

  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private authService: AuthService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    this.username = this.authService.getUserRut(); // Obtener el nombre de usuario al inicializar el componente
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  logout(): void {
    this.authService.logout(); // Lógica para cerrar sesión
  }
}
