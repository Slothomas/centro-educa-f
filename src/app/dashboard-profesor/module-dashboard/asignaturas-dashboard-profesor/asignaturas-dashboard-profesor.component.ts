import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared.service';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'primeng/carousel';
import { ProfesoresService } from 'src/app/profesores.service';


@Component({
  selector: 'app-asignaturas-dashboard-profesor',
  standalone: true,
  providers: [ProfesoresService],
  imports: [CommonModule, CarouselModule],
  templateUrl: './asignaturas-dashboard-profesor.component.html',
  styleUrls: ['./asignaturas-dashboard-profesor.component.css']
})
export class AsignaturasDashboardProfesorComponent implements OnInit  {
  asignaturas: any[] = []; // Definir el tipo de las asignaturas
  rutProfesor: any = null;
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
    private profesoresService: ProfesoresService
  ) {}

  ngOnInit(): void {
    this.obtenerDatosProfesor();
  }

  obtenerDatosProfesor(): void {
    this.sharedService.getProfesorData().subscribe(profesor => {
      if (profesor) {
        this.rutProfesor = profesor.rut_str;
        this.obtenerAsignaturas(this.rutProfesor);
      } else {
        console.error('El rut del profesor no está disponible.');
      }
    });
  }


  obtenerAsignaturas(rutProfesor: string): void {
    if (rutProfesor) {
      this.profesoresService.resumeAsignaturas(rutProfesor).subscribe(
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
