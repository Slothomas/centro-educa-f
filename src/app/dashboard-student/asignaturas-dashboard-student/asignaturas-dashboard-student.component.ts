import { Component, OnInit } from '@angular/core';
import { EstudiantesService } from '../../estudiantes.service';
import { SharedService } from 'src/app/shared.service';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'primeng/carousel';

@Component({
  selector: 'app-asignaturas-dashboard-student',
  standalone: true,
  providers: [EstudiantesService],
  imports: [CommonModule, CarouselModule],
  templateUrl: './asignaturas-dashboard-student.component.html',
  styleUrls: ['./asignaturas-dashboard-student.component.css']
})
export class AsignaturasDashboardStudentComponent implements OnInit {
  asignaturas: any[] = []; // Definir el tipo de las asignaturas
  rutEstudiante: any = null;
  idCurso: any = null;
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
    private sharedService: SharedService,
    private estudiantesService: EstudiantesService
  ) {}

  ngOnInit(): void {
    this.obtenerDatosEstudiante();
  }

  obtenerDatosEstudiante(): void {
    this.sharedService.getEstudianteData().subscribe(estudiante => {
      if (estudiante) {
        this.rutEstudiante = estudiante.rut_str;
        this.idCurso = estudiante.idCurso_int;
        this.obtenerAsignaturas(this.rutEstudiante, this.idCurso);
      } else {
        console.error('El rut del estudiante no está disponible.');
      }
    });
  }

  obtenerAsignaturas(rutEstudiante: string, idCurso_int: number): void {
    if (rutEstudiante) {
      this.estudiantesService.obtenerAsignaturas(rutEstudiante, idCurso_int).subscribe(
        (data) => {
          // Almacena todos los datos de las asignaturas
          this.asignaturas = data;
          // Envía los datos de las asignaturas al servicio SharedService
          this.sharedService.setAsignaturasData(this.asignaturas);
        },
        (error) => {
          console.error('Error al obtener las asignaturas:', error);
        }
      );
    } else {
      console.error('El rut del estudiante no está disponible.');
    }
  }
}
