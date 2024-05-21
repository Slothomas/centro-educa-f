
import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { inject } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent  {
  authService = inject(AuthService);
  user?: any;

  //constructor() {
  //  this.authService.getCurrentAuthUser().subscribe((r) => {
   //   console.log(r);
     // this.user = r;
   // });
  //}

  logout() {
    this.authService.logout();
  }

  refreshToken() {
    this.authService.refreshToken()?.subscribe(() => {});
  }
}
