import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CardModule } from 'primeng/card';
import { EstudiantesService } from 'src/app/estudiantes.service';


@Component({
  selector: 'app-promedios-asignatura',
  standalone: true,
  imports: [CommonModule, CardModule],
  templateUrl: './promedios-asignatura.component.html',
  styleUrls: ['../moduleasignatura-dashboard-student/moduleasignatura-dashboard-student.component.css','./promedios-asignatura.component.css']
})

export class PromediosAsignaturaComponent implements OnInit, OnChanges {

  @Input() rutEstudiante!: string; // Rut del estudiante
  @Input() idCurso!: number; // ID del curso
  @Input() idAsignatura!: number; // ID de la asignatura

  datos: any[] = []; // Datos de la asignatura, inicializado como array vacío

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
      this.estudiantesService.obtenerDetallePromedioNotaAsistencia(this.rutEstudiante, this.idCurso, this.idAsignatura).subscribe(
        (data) => {
          console.log('Data received:', data);
          this.datos = data; // Asignar todos los datos recibidos
        },
        (error) => {
          console.error('Error al obtener los datos:', error);
        }
      );
    }
  }
}
