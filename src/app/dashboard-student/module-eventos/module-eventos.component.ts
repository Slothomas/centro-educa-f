import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { EstudiantesService } from 'src/app/estudiantes.service';
import { SharedService } from 'src/app/shared.service';

@Component({
  selector: 'app-module-eventos',
  standalone: true,
  imports: [CommonModule,MatIconModule],
  templateUrl: './module-eventos.component.html',
  styleUrls: ['./module-eventos.component.css']
})
export class ModuleEventosComponent implements OnInit{

  rutEstudiante: any | null = null; // Rut del estudiante
  datos: any[] = []; // Datos de la asignatura, inicializado como array vacío


  constructor(private sharedService: SharedService, private estudianteService: EstudiantesService) {}

  ngOnInit(): void {
    this.obtenerDatosEstudiante();
    this.obtenerDetalleEventos();
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

  obtenerDetalleEventos(): void {
    // Obtener los eventos del estudiante
    this.estudianteService.obtenerDetalleEventos(this.rutEstudiante).subscribe(eventos => {
      if (eventos) {
        // Asignar los eventos del estudiante
        console.log('Eventos:', eventos);
        this.datos = eventos;
      } else {
        console.error('No hay eventos disponibles.');
      }
    });
  }

}
