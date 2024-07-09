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
import { FuncionesAdminComponent } from './../funciones-admin/funciones-admin.component'

interface loginData {
  rut: string,
  idtiporol: number
}

@Component({
  selector: 'app-module-dashboard',
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
    FuncionesAdminComponent],
  templateUrl: './module-dashboard.component.html',
  styleUrls: ['./module-dashboard.component.css']
})
export class ModuleDashboardAdminComponent implements OnInit, OnDestroy {

  username: string | null = null; // Nombre del estudiante
  mobileQuery: MediaQueryList; // Media query para detectar dispositivos móviles
  asignaturas: any[] = []; // Lista de asignaturas
  asignaturasMenuOpened = false; // Estado del menú de asignaturas (abierto/cerrado)
  loginData: loginData[] = [];

  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private authService: AuthService,
    private sharedService: SharedService,
    private router: Router
  ) {
    // Inicialización de media query
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {

    // Obtener datos de inicio de sesión
    const loginData = this.sharedService.getLoginData();

    const username = loginData.rut; // rut admin

    if (username) {
      this.username = username
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


  toggleAsignaturasMenu(): void {
    // Método para alternar el estado del menú de asignaturas (abierto/cerrado)
    this.asignaturasMenuOpened = !this.asignaturasMenuOpened;
  }



}
