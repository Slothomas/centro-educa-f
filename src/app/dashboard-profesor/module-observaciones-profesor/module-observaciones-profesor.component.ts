import { Component, OnInit } from '@angular/core';
import { ProfesoresService } from 'src/app/profesores.service';
import { SharedService } from 'src/app/shared.service';
import { AccordionModule } from 'primeng/accordion';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { DividerModule } from 'primeng/divider';

interface Observacion {
  ID_Asignatura: number,
  Nombre_Curso: string;
  Nombre_Asignatura: string;
  Nombre_Estudiante: string;
  Descripcion_Observacion: string;
  Tipo_Observacion: string;
  Fecha_Registro?: string;
  Rut_Estudiante: string;
}

@Component({
  selector: 'app-module-observaciones-profesor',
  standalone: true,
  imports: [
    TableModule,
    CommonModule,
    CardModule,
    TabViewModule,
    ButtonModule,
    ToastModule,
    AccordionModule,
    DialogModule,
    ConfirmDialogModule,
    FormsModule,
    MatIconModule,
    RouterLink,
    DropdownModule,
    DialogModule,
    DividerModule
  ],
  templateUrl: './module-observaciones-profesor.component.html',
  styleUrls: ['./module-observaciones-profesor.component.css'],
  providers: [MessageService]
})

export class ModuleObservacionesProfesorComponent implements OnInit {

  rutProfesor!: string;
  datos: Observacion[] = [];
  cursos: string[] = [];
  estudiantesPorCurso: { curso: string, estudiantes: string[] }[] = [];
  displayPopup: boolean = false;
  selectedCurso: string | null = null;
  selectedAsignatura: string | null = null;
  selectedEstudiante: string | null = null;
  selectedTipo: string | null = null;
  observacionDescripcion: string = '';

  tipoObservaciones: { label: string, value: string, id: number }[] = [
    { label: 'Felicitación', value: 'Felicitación', id: 3 },
    { label: 'Llamado a apoderados', value: 'Llamado a apoderados', id: 7 },
    { label: 'Comportamiento inadecuado', value: 'Comportamiento inadecuado', id: 4 },
    { label: 'Mejora continua', value: 'Mejora continua', id: 10 },
    { label: 'Amonestación', value: 'Amonestación', id: 5 },
    { label: 'Incidente disciplinario', value: 'Incidente disciplinario', id: 8 },
    { label: 'Rendimiento académico', value: 'Rendimiento académico', id: 6 },
    { label: 'Salud', value: 'Salud', id: 9 }
  ];

  constructor(
    private sharedService: SharedService,
    private profesoresService: ProfesoresService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.obtenerDatosProfesor();
  }

  obtenerDatosProfesor(): void {
    this.sharedService.getProfesorData().subscribe(profesor => {
      if (profesor) {
        this.rutProfesor = profesor.rut_str;
        this.obtenerDatosObservaciones();
      } else {
        console.error('El rut del profesor no está disponible.');
      }
    });
  }

  obtenerDatosObservaciones(): void {
    this.profesoresService.obtenerObservaciones(this.rutProfesor).subscribe(observaciones => {
      if (observaciones) {
        this.datos = observaciones;
        this.obtenerCursosUnicos();
      } else {
        console.error('No hay observaciones disponibles.');
      }
    });
  }

  obtenerCursosUnicos(): void {
    this.cursos = [...new Set(this.datos.map(item => item.Nombre_Curso))];
    this.cursos.forEach(curso => {
      const estudiantesCurso = this.obtenerEstudiantesCurso(curso);
      this.estudiantesPorCurso.push({ curso: curso, estudiantes: estudiantesCurso });
    });
  }

  obtenerEstudiantesCurso(curso: string): string[] {
    return [...new Set(this.datos.filter(item => item.Nombre_Curso === curso).map(item => item.Nombre_Estudiante))];
  }

  abrirPopup(): void {
    this.displayPopup = true;
  }

  cerrarPopup(): void {
    this.displayPopup = false;
    this.resetFormulario();
  }

  guardarObservacion(): void {
    if (!this.selectedEstudiante || !this.selectedAsignatura) {
      this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Debe seleccionar un estudiante y una asignatura.' });
      return;
    }

    const rutEstudiante = this.obtenerRutEstudiante(this.selectedEstudiante);
    const idAsignatura = this.obtenerIdAsignatura(this.selectedAsignatura);

    if (!rutEstudiante) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se encontró el Rut del estudiante seleccionado.' });
      return;
    }

    if (!idAsignatura) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se encontró el ID de la asignatura seleccionada.' });
      return;
    }

    // Obtener el ID numérico del tipo de observación seleccionado
    const tipoObservacionSeleccionado = this.tipoObservaciones.find(tipo => tipo.label === this.selectedTipo);
    if (!tipoObservacionSeleccionado) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se encontró el tipo de observación seleccionado.' });
      return;
    }

    const nuevaObservacion: Observacion = {
      ID_Asignatura: idAsignatura,
      Nombre_Curso: this.selectedCurso!,
      Nombre_Asignatura: this.selectedAsignatura!,
      Nombre_Estudiante: this.selectedEstudiante!,
      Descripcion_Observacion: this.observacionDescripcion,
      Tipo_Observacion: this.selectedTipo!,
      Rut_Estudiante: rutEstudiante
    };

    // Preparar datos para enviar al backend
    const formData = new FormData();
    formData.append('rutProfesor_str', this.rutProfesor); // Enviar el rut del profesor como número
    formData.append('idAsignatura_int', String(idAsignatura)); // Enviar el ID de asignatura como número entero
    formData.append('idTipoObservacion_int', String(tipoObservacionSeleccionado.id)); // Enviar el ID de tipo de observación como número entero
    formData.append('descripcion', nuevaObservacion.Descripcion_Observacion);
    formData.append('rutEstudiante_str', rutEstudiante); // Enviar el rut del estudiante como número

    //imprimir cada variable por consola
    console.log('rutProfesor_int', this.rutProfesor);
    console.log('idAsignatura_int', idAsignatura);
    console.log('idTipoObservacion_int', tipoObservacionSeleccionado.id);
    console.log('descripcion', nuevaObservacion.Descripcion_Observacion);
    console.log('rutEstudiante_int', rutEstudiante);


    // Llamar servicio para crear observación
    this.profesoresService.crearObservacion(formData).subscribe(
      (response: any) => {
        this.messageService.add({ severity: 'success', summary: 'Observación creada', detail: 'La observación ha sido creada exitosamente' });
        this.obtenerDatosObservaciones(); // Actualizar lista de observaciones
        this.cerrarPopup(); // Cerrar popup
      },
      (error: any) => {
        console.error('Error al crear observación:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear la observación' });
      }
    );
  }

  obtenerRutEstudiante(nombreEstudiante: string): string | undefined {
    const observacion = this.datos.find(item => item.Nombre_Estudiante === nombreEstudiante);
    return observacion ? observacion.Rut_Estudiante : undefined;
  }

  obtenerIdAsignatura(nombreAsignatura: string): number | undefined {
    const observacion = this.datos.find(item => item.Nombre_Asignatura === nombreAsignatura);
    return observacion ? observacion.ID_Asignatura : undefined;
  }

  resetFormulario(): void {
    this.selectedCurso = null;
    this.selectedAsignatura = null;
    this.selectedEstudiante = null;
    this.selectedTipo = null;
    this.observacionDescripcion = '';
  }

  getAsignaturasDropdownOptions(): { label: string, value: string }[] {
    if (!this.selectedCurso) return [];
    return this.obtenerAsignaturasCurso(this.selectedCurso).map(asignatura => ({
      label: asignatura,
      value: asignatura
    }));
  }

  obtenerAsignaturasCurso(curso: string): string[] {
    return [...new Set(this.datos.filter(item => item.Nombre_Curso === curso).map(item => item.Nombre_Asignatura))];
  }

  obtenerAsignaturasPorEstudiante(curso: string, estudiante: string): string[] {
    return [...new Set(this.datos.filter(item => item.Nombre_Curso === curso && item.Nombre_Estudiante === estudiante).map(item => item.Nombre_Asignatura))];
  }

  obtenerObservaciones(curso: string, estudiante: string, asignatura: string): Observacion[] {
    return this.datos.filter(item => item.Nombre_Curso === curso && item.Nombre_Estudiante === estudiante && item.Nombre_Asignatura === asignatura);
  }

  getEstudiantesDropdownOptions(): { label: string, value: string }[] {
    if (!this.selectedCurso) return [];
    const estudiantes = this.obtenerEstudiantesCurso(this.selectedCurso);
    return estudiantes.map(estudiante => ({
      label: estudiante,
      value: estudiante
    }));
  }

  getCursosDropdownOptions(): { label: string, value: string }[] {
    if (!this.cursos || this.cursos.length === 0) return [];
    return this.cursos.map(curso => ({
      label: curso,
      value: curso
    }));
  }

}
