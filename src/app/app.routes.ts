import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MenuComponent } from './menu/menu.component';
import { MenuDashboardStudentComponent } from './dashboard-student/module-dashboard/menu-dashboard-student/menu-dashboard-student.component';
import { ModuleasignaturaDashboardStudentComponent } from './dashboard-student/module-asignatura/moduleasignatura-dashboard-student/moduleasignatura-dashboard-student.component';
import { authGuard } from './auth.guard';
import { PerfilDashboardComponent } from './shared-component/perfil-dashboard/perfil-dashboard.component';
import { ModuleEventosComponent } from './dashboard-student/module-eventos/module-eventos.component';
import { ModuleObservacionesComponent } from './dashboard-student/module-observaciones/module-observaciones.component';
import { MenuDashboardProfesorComponent } from './dashboard-profesor/module-dashboard/menu-dashboard-profesor/menu-dashboard-profesor.component';
import { ModuleasignaturaDashboardProfesorComponent } from './dashboard-profesor/module-asignatura/moduleasignatura-dashboard-profesor/moduleasignatura-dashboard-profesor.component';
import { ModuleEventosProfesorComponent } from './dashboard-profesor/module-eventos-profesor/module-eventos-profesor.component';
import { ModuleObservacionesProfesorComponent } from './dashboard-profesor/module-observaciones-profesor/module-observaciones-profesor.component';

export const routes: Routes = [
  { title: 'Colegio | Home', path: 'home', component: MenuComponent },
  { title: 'Colegio | Login', path: 'login', component: LoginComponent },
  {
    title: 'Colegio | Dashboard Estudiante',
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
  {
    title: 'Colegio | Dashboard Profesor',
    path: 'dashboardteachers',
    component: MenuDashboardProfesorComponent,
    canActivate: [authGuard], // Aplica el guardia de autenticación aquí
    children: [
      { path: 'asignatura/:idCurso/:idAsignatura', component: ModuleasignaturaDashboardProfesorComponent },
      { path: 'perfil', component: PerfilDashboardComponent},
      { path: 'eventos', component: ModuleEventosProfesorComponent},
      { path: 'observaciones', component: ModuleObservacionesProfesorComponent}
    ]
  },
  { title: 'Colegio | Home', path: '**', component: MenuComponent }
];
