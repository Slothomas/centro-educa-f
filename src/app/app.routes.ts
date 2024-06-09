import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MenuComponent } from './menu/menu.component';
import { MenuDashboardStudentComponent } from './dashboard-student/menu-dashboard-student/menu-dashboard-student.component';
import { ModuleasignaturaDashboardStudentComponent } from './dashboard-student/module-asignatura/moduleasignatura-dashboard-student/moduleasignatura-dashboard-student.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { title: 'Colegio | Home', path: 'home', component: MenuComponent },
  { title: 'Colegio | Login', path: 'login', component: LoginComponent },
  {
    title: 'Colegio | Dashboard',
    path: 'dashboardstudents',
    component: MenuDashboardStudentComponent,
    canActivate: [authGuard], // Aplica el guardia de autenticación aquí
    children: [
      { path: 'asignatura/:id', component: ModuleasignaturaDashboardStudentComponent }
    ]
  },
  { title: 'Colegio | Home', path: '**', component: MenuComponent }
];
