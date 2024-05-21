import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MenuComponent } from './menu/menu.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authGuard } from './auth.guard';


export const routes: Routes = [
  {title: 'Colegio | Home', path: 'home', component: MenuComponent},
  {title: 'Colegio | Login', path: 'login', component: LoginComponent},
  {title: 'Colegio | Dashboard', path: 'dashboard', component: DashboardComponent, canActivate: [authGuard]},
  {title: 'Colegio | Home', path: '**', component: MenuComponent}





];
