import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ProfesoresService } from 'src/app/profesores.service';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { NotaService } from 'src/app/nota.service'; // Importa el servicio de notas

@Component({
  selector: 'app-promedios-asignatura',
  standalone: true,
  imports: [CommonModule, CardModule],
  templateUrl: './promedios-asignatura.component.html',
  styleUrls: ['../moduleasignatura-dashboard-profesor/moduleasignatura-dashboard-profesor.component.css', './promedios-asignatura.component.css']
})
export class PromediosAsignaturaComponent implements OnInit, OnChanges {

  @Input() rutProfesor!: string; // Rut del estudiante
  @Input() idCurso!: number; // ID del curso
  @Input() idAsignatura!: number; // ID de la asignatura

  datos: any[] = []; // Datos de la asignatura, inicializado como array vacío

  constructor(
    private profesoresService: ProfesoresService,
    private notaService: NotaService // Inyecta el servicio de notas
  ) { }

  ngOnInit(): void {
    this.obtenerDetallePromedioNotaAsistencia();

    // Suscripción al evento de nota actualizada
    this.notaService.notaActualizada$.subscribe(() => {
      this.obtenerDetallePromedioNotaAsistencia();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Detectar cambios en las entradas y volver a obtener los datos si hay cambios
    if (changes['rutProfesor'] || changes['idCurso'] || changes['idAsignatura']) {
      this.obtenerDetallePromedioNotaAsistencia();
    }
  }

  obtenerDetallePromedioNotaAsistencia(): void {
    // Obtener los datos de la asignatura si todas las entradas están disponibles
    if (this.rutProfesor && this.idCurso && this.idAsignatura) {
      console.log('Fetching data with:', this.rutProfesor, this.idCurso, this.idAsignatura);
      // Llamar al servicio para obtener los detalles de la asignatura
      this.profesoresService.obtenerDetallePromedioNotaAsistencia(this.rutProfesor, this.idCurso, this.idAsignatura).subscribe(
        (data) => {
          console.log('Data received:', data);
          this.datos = data.length > 0 ? data : null; // Asignar los datos recibidos
        },
        (error) => {
          console.error('Error al obtener los datos:', error);
        }
      );
    }
  }
}
