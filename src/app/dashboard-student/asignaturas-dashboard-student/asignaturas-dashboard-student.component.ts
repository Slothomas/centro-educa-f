import { Component, OnInit } from '@angular/core';
import { EstudianteService } from '../../estudiantes.service';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/auth.service';
import { CarouselModule } from 'primeng/carousel';

@Component({
  selector: 'app-asignaturas-dashboard-student',
  standalone: true,
  providers: [EstudianteService],
  imports: [CommonModule, CarouselModule],
  templateUrl: './asignaturas-dashboard-student.component.html',
  styleUrls: ['./asignaturas-dashboard-student.component.css']
})

export class AsignaturasDashboardStudentComponent implements OnInit {
  asignaturas: any[] = [];
  responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 3,
    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 2,
    },
  ];

  constructor(
    private estudianteService: EstudianteService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const rutEstudiante = this.authService.getUserRut();
    if (rutEstudiante !== null) {
      this.obtenerAsignaturas(rutEstudiante);
    } else {
      console.error('El rut del estudiante no está disponible.');
      // Puedes manejar este caso de otra forma, por ejemplo, redirigiendo al usuario a la página de inicio de sesión.
    }
  }

  obtenerAsignaturas(rutEstudiante: string): void {
    this.estudianteService.obtenerAsignaturas(rutEstudiante).subscribe(
      (data) => {
        this.asignaturas = data;
      },
      (error) => {
        console.error('Error al obtener las asignaturas:', error);
      }
    );
  }
}
