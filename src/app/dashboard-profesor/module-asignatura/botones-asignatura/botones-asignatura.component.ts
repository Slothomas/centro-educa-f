import { Component, Input, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { ProfesoresService } from 'src/app/profesores.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { CheckboxModule } from 'primeng/checkbox';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { NotaService } from 'src/app/nota.service';

interface Dato {
  Fecha_Registro: string;
  Nombre_Estudiante: string;
  Rut_Estudiante: string;
  asistencia: number;
}

@Component({
  selector: 'app-botones-asignatura',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CheckboxModule,
    TableModule,
    DropdownModule,
    ButtonModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './botones-asignatura.component.html',
  styleUrls: [
    '../moduleasignatura-dashboard-profesor/moduleasignatura-dashboard-profesor.component.css',
    './botones-asignatura.component.css'
  ]
})

export class BotonesAsignaturaComponent implements OnInit, OnChanges {
  @Input() rutProfesor!: string;
  @Input() idCurso!: number;
  @Input() idAsignatura!: number;

  datosOriginales: Dato[] = [];
  estudiantesUnicos: Dato[] = [];
  fechasDisponibles: string[] = [];
  fechaSeleccionada: string = '';
  today : string = '';

  constructor(private profesoresService: ProfesoresService, private messageService: MessageService, private notaService: NotaService) {
    this.today = this.obtenerFechaActual(); // Obtener la fecha actual en formato 'YYYY-MM-DD'
  }

  ngOnInit(): void {
    this.obtenerDatos();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (['idCurso'] || ['idAsignatura']) {
      this.obtenerDatos();
    }
  }

  obtenerDatos(): void {
    if (this.idCurso && this.idAsignatura) {
      this.profesoresService.obtenerLista(this.idCurso, this.idAsignatura).subscribe(
        (data: Dato[]) => {
          this.datosOriginales = data.map(dato => ({ ...dato, asistencia: 6 })); // Inicializa todos los estudiantes como ausentes
          this.estudiantesUnicos = this.obtenerEstudiantesUnicos(this.datosOriginales);
          this.fechasDisponibles = this.obtenerFechasDisponibles(this.datosOriginales);
          this.fechaSeleccionada = this.fechasDisponibles.length > 0 ? this.fechasDisponibles[0] : ''; // Selecciona la primera fecha por defecto
          console.log('BotonesAsignaturaComponent.obtenerDatos - data:', data);
        },
        (error: any) => {
          console.error('BotonesAsignaturaComponent.obtenerDatos - error:', error);
        }
      );
    }
  }

  obtenerEstudiantesUnicos(data: Dato[]): Dato[] {
    const estudiantesMap = new Map<string, Dato>();
    data.forEach(dato => {
      if (!estudiantesMap.has(dato.Nombre_Estudiante)) {
        estudiantesMap.set(dato.Nombre_Estudiante, dato);
      }
    });
    return Array.from(estudiantesMap.values());
  }

  obtenerFechasDisponibles(data: Dato[]): string[] {
    return Array.from(new Set(data.map(dato => dato.Fecha_Registro)));
  }

  onFechaSeleccionadaChange(event: any): void {
    this.fechaSeleccionada = event.value;
  }

  // Función para verificar si el checkbox debe estar habilitado
  esCheckboxHabilitado(): boolean {
    return this.fechaSeleccionada === this.today;
  }

  // Función para manejar el cambio del estado del checkbox
  onCheckboxChange(event: any, dato: Dato): void {
    dato.asistencia = event.checked ? 5 : 6;
  }

  enviarAsistencia(): void {
    const asistencia = this.estudiantesUnicos.map(dato => ({
      rutEstudiante_str: dato.Rut_Estudiante,
      idTipoEstado_int: dato.asistencia, // Utiliza la propiedad asistencia
      fechaRegistro_dat: this.fechaSeleccionada,
      idAsignatura_int: this.idAsignatura,
      idCurso_int: this.idCurso
    }));

    console.log('BotonesAsignaturaComponent.enviarAsistencia - asistencia:', asistencia);

    this.profesoresService.enviarAsistencia(asistencia).subscribe(
      response => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Asistencia enviada correctamente' });
        console.log('BotonesAsignaturaComponent.enviarAsistencia - response:', response);
        this.notaService.emitirNotaActualizada(); // Emitir evento cuando se actualice la nota
      },
      error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al enviar asistencia' });
        console.error('BotonesAsignaturaComponent.enviarAsistencia - error:', error);
      }
    );
  }

    // Función para obtener la fecha actual en formato 'YYYY-MM-DD'
    obtenerFechaActual(): string {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0'); // Mes empieza desde 0
      const day = String(today.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
}
