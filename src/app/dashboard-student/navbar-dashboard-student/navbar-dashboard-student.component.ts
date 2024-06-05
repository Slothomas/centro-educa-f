import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { SharedService } from 'src/app/shared.service';
import { CommonModule } from '@angular/common';
import { EstudiantesService } from 'src/app/estudiantes.service';

@Component({
  selector: 'app-navbar-dashboard-student',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar-dashboard-student.component.html',
  styleUrls: ['./navbar-dashboard-student.component.css']
})
export class NavbarDashboardStudentComponent implements OnInit {
  username: string | null = null;

  constructor(
    private authService: AuthService,
    private estudiantesService: EstudiantesService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    console.log('NavbarDashboardStudentComponent.ngOnInit');
    const loginData = this.sharedService.getLoginData();
    console.log('NavbarDashboardStudentComponent.ngOnInit - loginData:', loginData);

    const rutEstudiante = loginData.rut;
    if (rutEstudiante) {
      console.log('NavbarDashboardStudentComponent.ngOnInit - calling getDatosEstudiante with RUT:', rutEstudiante);
      this.estudiantesService.getDatosEstudiante(rutEstudiante).subscribe(
        (data) => {
          console.log('NavbarDashboardStudentComponent.ngOnInit - datos del estudiante:', data);
          if (data) {
            this.username = data.nombres_str;
            console.log('NavbarDashboardStudentComponent.ngOnInit - username set to:', this.username);
          }
        },
        (error) => {
          console.error('NavbarDashboardStudentComponent.ngOnInit - error al obtener datos del estudiante:', error);
        }
      );
    } else {
      console.error('NavbarDashboardStudentComponent.ngOnInit - RUT del estudiante no disponible');
    }
  }

  logout(): void {
    console.log('NavbarDashboardStudentComponent.logout');
    this.authService.logout();
  }
}
