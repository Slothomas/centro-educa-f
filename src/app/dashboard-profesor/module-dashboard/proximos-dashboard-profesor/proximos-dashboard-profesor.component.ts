import { SharedService } from 'src/app/shared.service';
import { Component, OnInit } from '@angular/core';
import { TimelineModule } from 'primeng/timeline';
import { CommonModule } from '@angular/common';
import { ProfesoresService } from 'src/app/profesores.service';


@Component({
  selector: 'app-proximos-dashboard-profesor',
  standalone  : true,
  imports: [TimelineModule, CommonModule],
  templateUrl: './proximos-dashboard-profesor.component.html',
  styleUrls: ['./proximos-dashboard-profesor.component.css']
})
export class ProximosDashboardProfesorComponent implements OnInit{


  eventos: any[] = [];
  rutProfesor: any = null; // Inicializar como nulo

  constructor(
    private profesoresService: ProfesoresService,
    private sharedService: SharedService // Inyecta SharedService en el constructor
  ) {}

  ngOnInit(): void {
    console.log('ProximosDashboardProfesorComponent.ngOnInit');

    this.obtenerDatosProfesor();
  }

  obtenerDatosProfesor(): void {
    this.sharedService.getProfesorData().subscribe(profesor => {
      if (profesor) {
        console.log('ProximosDashboardStudentComponent.obtenerDatosEstudiante - datos del estudiante:', profesor);
        this.rutProfesor = profesor.rut_str; // Actualiza el rutEstudiante con el valor del estudiante
        this.obtenerProximos(this.rutProfesor); // Llama a obtenerEventosProximos con el rutEstudiante
      } else {
        console.error('El rut del estudiante no está disponible.');
      }
    });
  }

  obtenerProximos(rutProfesor: string): void {
    console.log('ProximosDashboardStudentComponent.obtenerEventosProximos - calling service for RUT:', rutProfesor);
    this.profesoresService.resumeProximos(rutProfesor).subscribe(
      (data) => {
        this.eventos = data.sort((a: any, b: any) => new Date(a.Fecha).getTime() - new Date(b.Fecha).getTime());
        console.log('ProximosDashboardStudentComponent.obtenerEventosProximos - proximos eventos:', data);
      },
      (error) => {
        console.error('Error al obtener los eventos próximos:', error);
      }
    );
  }
}
