import { SharedService } from './../../shared.service';
import { Component, OnInit } from '@angular/core';
import { EstudiantesService } from 'src/app/estudiantes.service';
import { TimelineModule } from 'primeng/timeline';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-proximos-dashboard-student',
  standalone: true,
  imports: [TimelineModule, CommonModule],
  templateUrl: './proximos-dashboard-student.component.html',
  styleUrls: ['./proximos-dashboard-student.component.css']
})
export class ProximosDashboardStudentComponent implements OnInit {

  eventos: any[] = [];
  rutEstudiante: any = null; // Inicializar como nulo

  constructor(
    private estudiantesService: EstudiantesService,
    private sharedService: SharedService // Inyecta SharedService en el constructor
  ) {}

  ngOnInit(): void {
    console.log('ProximosDashboardStudentComponent.ngOnInit');

    this.obtenerDatosEstudiante();
  }

  obtenerDatosEstudiante(): void {
    this.sharedService.getEstudianteData().subscribe(estudiante => {
      if (estudiante) {
        console.log('ProximosDashboardStudentComponent.obtenerDatosEstudiante - datos del estudiante:', estudiante);
        this.rutEstudiante = estudiante.rut_str; // Actualiza el rutEstudiante con el valor del estudiante
        this.obtenerEventosProximos(this.rutEstudiante); // Llama a obtenerEventosProximos con el rutEstudiante
      } else {
        console.error('El rut del estudiante no está disponible.');
      }
    });
  }

  obtenerEventosProximos(rutEstudiante: string): void {
    console.log('ProximosDashboardStudentComponent.obtenerEventosProximos - calling service for RUT:', rutEstudiante);
    this.estudiantesService.getProximosEventos(rutEstudiante).subscribe(
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
