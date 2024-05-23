import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MenuComponent } from './menu/menu.component';
import { authGuard } from './auth.guard';
import { MenuDashboardStudentComponent } from './dashboard-student/menu-dashboard-student/menu-dashboard-student.component';


export const routes: Routes = [
  {title: 'Colegio | Home', path: 'home', component: MenuComponent},
  {title: 'Colegio | Login', path: 'login', component: LoginComponent},
  {title: 'Colegio | Dashboard', path: 'dashboardstudents', component: MenuDashboardStudentComponent},
  {title: 'Colegio | Home', path: '**', component: MenuComponent}





];
