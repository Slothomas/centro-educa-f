import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ProfesoresService } from 'src/app/profesores.service';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detalle-asignatura',
  standalone  : true,
  imports: [CommonModule, CardModule],
  templateUrl: './detalle-asignatura.component.html',
  styleUrls: ['../moduleasignatura-dashboard-profesor/moduleasignatura-dashboard-profesor.component.css','./detalle-asignatura.component.css']
})
export class DetalleAsignaturaComponent implements OnInit, OnChanges{

  @Input() rutProfesor!: string;
  @Input() idCurso!: number;
  @Input() idAsignatura!: number;

  datos: any;

  constructor(private profesoresService: ProfesoresService) { }

  ngOnInit(): void {
    this.obtenerDetalleAsignatura();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Detectar cambios en las entradas y volver a obtener los datos si hay cambios
    if (changes['rutProfesor'] || changes['idCurso'] || changes['idAsignatura']) {
      this.obtenerDetalleAsignatura();
    }
  }

  obtenerDetalleAsignatura(): void {
    // Obtener los datos de la asignatura si todas las entradas están disponibles
    if (this.rutProfesor && this.idCurso && this.idAsignatura) {
      console.log('Fetching data with:', this.rutProfesor, this.idCurso, this.idAsignatura);
      // Llamar al servicio para obtener los detalles de la asignatura
      this.profesoresService.obtenerDetalleAsignatura(this.rutProfesor, this.idCurso, this.idAsignatura).subscribe(
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
