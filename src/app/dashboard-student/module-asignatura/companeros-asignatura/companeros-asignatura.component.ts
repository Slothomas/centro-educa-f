import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { EstudiantesService } from 'src/app/estudiantes.service';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';


@Component({
  selector: 'app-companeros-asignatura',
  standalone  : true,
  imports: [TableModule, CommonModule, CardModule],
  templateUrl: './companeros-asignatura.component.html',
  styleUrls: ['./companeros-asignatura.component.css']
})
export class CompanerosAsignaturaComponent implements OnInit, OnChanges {

  @Input() rutEstudiante!: string; // Rut del estudiante
  @Input() idCurso!: number; // ID del curso
  @Input() idAsignatura!: number; // ID de la asignatura

  datos: any[] = []; // Datos de la asignatura, inicializado como array vacío

  constructor(private estudianteService: EstudiantesService) { }

  ngOnInit(): void {
    this.obtenerDatos(); // Llamar al método para obtener los datos al inicializar el componente
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
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
      this.estudianteService.obtenerDetalleCompaneros(this.rutEstudiante, this.idCurso, this.idAsignatura).subscribe(
        (data) => {
          console.log('Data received obtenerDtos Compañeros componente :', data);
          this.datos = data; // Asignar los datos recibidos
        },
        (error) => {
          console.error('Error al obtener los datos:', error);
        }
      );
    }
  }
}
