import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { EstudiantesService } from 'src/app/estudiantes.service';
import { SharedService } from 'src/app/shared.service';

@Component({
  selector: 'app-module-observaciones',
  standalone: true,
  imports: [CommonModule,MatIconModule],
  templateUrl: './module-observaciones.component.html',
  styleUrls: ['./module-observaciones.component.css']
})
export class ModuleObservacionesComponent implements OnInit{

  rutEstudiante: any | null = null; // Rut del estudiante
  datos: any[] = []; // Datos de la asignatura, inicializado como array vacío


  constructor(private sharedService: SharedService, private estudianteService: EstudiantesService) {}

  ngOnInit(): void {
    this.obtenerDatosEstudiante();
    this.obtenerDatosObservaciones();
  }

  obtenerDatosEstudiante(): void {
    // Obtener los datos del estudiante del servicio compartido
    this.sharedService.getEstudianteData().subscribe(estudiante => {
      if (estudiante) {
        // Asignar los datos del estudiante
        this.rutEstudiante = estudiante.rut_str;
      } else {
        console.error('El rut del estudiante no está disponible.');
      }
    });
  }

  obtenerDatosObservaciones(): void {
    // Obtener las observaciones del estudiante
    this.estudianteService.obtenerDetalleObservaciones(this.rutEstudiante).subscribe(observaciones => {
      if (observaciones) {
        // Asignar las observaciones del estudiante
        console.log('Observaciones:', observaciones);
        this.datos = observaciones;
      } else {
        console.error('No hay observaciones disponibles.');
      }
    });
  }
}
