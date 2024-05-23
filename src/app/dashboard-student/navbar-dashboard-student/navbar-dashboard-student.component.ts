import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar-dashboard-student',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar-dashboard-student.component.html',
  styleUrls: ['./navbar-dashboard-student.component.css']
})
export class NavbarDashboardStudentComponent implements OnInit {
  username: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.username = this.authService.getUserRut();
  }

  logout(): void {
    this.authService.logout();
  }
}
