import { Component, OnInit } from '@angular/core';
import { EstudiantesService } from '../../estudiantes.service';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'primeng/carousel';
import { SharedService } from 'src/app/shared.service';

@Component({
  selector: 'app-asignaturas-dashboard-student',
  standalone: true,
  providers: [EstudiantesService],
  imports: [CommonModule, CarouselModule],
  templateUrl: './asignaturas-dashboard-student.component.html',
  styleUrls: ['./asignaturas-dashboard-student.component.css']
})
export class AsignaturasDashboardStudentComponent implements OnInit {
  asignaturas: any[] = [];
  responsiveOptions: any[] = [
    {
      breakpoint: '1600px',
      numVisible: 5,
      numScroll: 5,
    },
    {
      breakpoint: '1200px',
      numVisible: 4,
      numScroll: 4,
    },
    {
      breakpoint: '900px',
      numVisible: 3,
      numScroll: 3,
    },
    {
      breakpoint: '650px',
      numVisible: 2,
      numScroll: 2,
    },
  ];

  constructor(
    private estudianteService: EstudiantesService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    console.log('AsignaturasDashboardStudentComponent.ngOnInit');
    const loginData = this.sharedService.getLoginData();
    console.log('AsignaturasDashboardStudentComponent.ngOnInit - loginData:', loginData);

    const rutEstudiante = loginData.rut;
    if (rutEstudiante) {
      console.log('AsignaturasDashboardStudentComponent.ngOnInit - calling getDatosEstudiante with RUT:', rutEstudiante);
      this.estudianteService.getDatosEstudiante(rutEstudiante).subscribe(
        (data) => {
          console.log('AsignaturasDashboardStudentComponent.ngOnInit - datos del estudiante:', data);
          if (data && data.length > 0) {
            const idCurso_int = data[0].idCurso_int;
            this.obtenerAsignaturas(rutEstudiante, idCurso_int);
          }
        },
        (error) => {
          console.error('Error al obtener datos del estudiante:', error);
        }
      );
    } else {
      console.error('El rut del estudiante no está disponible.');
    }
  }

  obtenerAsignaturas(rutEstudiante: string, idCurso_int: number): void {
    console.log('AsignaturasDashboardStudentComponent.obtenerAsignaturas - calling service for RUT:', rutEstudiante, 'and IDCurso:', idCurso_int);
    this.estudianteService.obtenerAsignaturas(rutEstudiante, idCurso_int).subscribe(
      (data) => {
        this.asignaturas = data;
        console.log('AsignaturasDashboardStudentComponent.obtenerAsignaturas - obtained subjects:', data);
      },
      (error) => {
        console.error('Error al obtener las asignaturas:', error);
      }
    );
  }
}
