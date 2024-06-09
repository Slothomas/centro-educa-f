import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { EstudiantesService } from 'src/app/estudiantes.service';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-detalle-asignatura',
  standalone: true,
  imports: [CommonModule, CardModule],
  templateUrl: './detalle-asignatura.component.html',
  styleUrls: ['./detalle-asignatura.component.css']
})
export class DetalleAsignaturaComponent implements OnInit, OnChanges {

    @Input() rutEstudiante!: string; // Rut del estudiante
    @Input() idCurso!: number; // ID del curso
    @Input() idAsignatura!: number; // ID de la asignatura

    datos: any; // Datos de la asignatura

    constructor(private estudiantesService: EstudiantesService) {}

    ngOnInit(): void {
      this.obtenerDatos(); // Llamar al método para obtener los datos al inicializar el componente
    }

    ngOnChanges(changes: SimpleChanges): void {
      // Detectar cambios en las entradas y volver a obtener los datos si hay cambios
      if (changes['rutEstudiante'] || changes['idCurso'] || changes['idAsignatura']) {
        this.obtenerDatos();
      }
    }

    obtenerDatos(): void {
      // Obtener los datos de la asignatura si todas las entradas están disponibles
      if (this.rutEstudiante && this.idCurso && this.idAsignatura) {
        console.log('Fetching data with:', this.rutEstudiante, this.idCurso, this.idAsignatura);
        // Llamar al servicio para obtener los detalles de la asignatura
        this.estudiantesService.obtenerDetalleAsignatura(this.rutEstudiante, this.idCurso, this.idAsignatura).subscribe(
          (data) => {
            console.log('Data received:', data);
            this.datos = data.length > 0 ? data[0] : null; // Asignar los datos recibidos
          },
          (error) => {
            console.error('Error al obtener los datos:', error);
          }
        );
      }
    }
  }
