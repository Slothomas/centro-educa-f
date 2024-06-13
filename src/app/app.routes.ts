import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MenuComponent } from './menu/menu.component';
import { MenuDashboardStudentComponent } from './dashboard-student/module-dashboard/menu-dashboard-student/menu-dashboard-student.component';
import { ModuleasignaturaDashboardStudentComponent } from './dashboard-student/module-asignatura/moduleasignatura-dashboard-student/moduleasignatura-dashboard-student.component';
import { authGuard } from './auth.guard';
import { PerfilDashboardComponent } from './shared-component/perfil-dashboard/perfil-dashboard.component';
import { ModuleEventosComponent } from './dashboard-student/module-eventos/module-eventos.component';
import { ModuleObservacionesComponent } from './dashboard-student/module-observaciones/module-observaciones.component';

export const routes: Routes = [
  { title: 'Colegio | Home', path: 'home', component: MenuComponent },
  { title: 'Colegio | Login', path: 'login', component: LoginComponent },
  {
    title: 'Colegio | Dashboard',
    path: 'dashboardstudents',
    component: MenuDashboardStudentComponent,
    canActivate: [authGuard], // Aplica el guardia de autenticación aquí
    children: [
      { path: 'asignatura/:id', component: ModuleasignaturaDashboardStudentComponent },
      { path: 'perfil', component: PerfilDashboardComponent},
      { path: 'eventos', component: ModuleEventosComponent},
      { path: 'observaciones', component: ModuleObservacionesComponent}
    ]
  },
  { title: 'Colegio | Home', path: '**', component: MenuComponent }
];
