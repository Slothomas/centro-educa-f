import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ProfesoresService } from 'src/app/profesores.service';
import { AccordionModule } from 'primeng/accordion';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FormsModule } from '@angular/forms';
import { NotaService } from 'src/app/nota.service';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { MatIconModule } from '@angular/material/icon';

interface Dato {
  ID_Asignatura: number;
  Nombre_Asignatura: string;
  Rut_Estudiante: string;
  Nombre_Estudiante: string;
  Fecha_Registro: string;
  Registro: number;
  Tipo: string;
}

interface TipoEvaluacion {
  idTipoNota_int: number;
  nombre_str: string;
}
interface Formulario {
  idCurso: number;
  idAsignatura: number;
  tipoCalificacion: TipoEvaluacion;
  fechaEvaluacion: Date;
  ponderacion: number;
  nombre: string;
  usuarioModificacion: string;
}

@Component({
  selector: 'app-alumnos-asignatura',
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
    CalendarModule,
    DropdownModule,
    MatIconModule
  ],
  templateUrl: './alumnos-asignatura.component.html',
  styleUrls: ['../moduleasignatura-dashboard-profesor/moduleasignatura-dashboard-profesor.component.css', './alumnos-asignatura.component.css'],
  providers: [MessageService, ProfesoresService, DialogService, DynamicDialogRef]
})
export class AlumnosAsignaturaComponent implements OnInit, OnChanges {
  @Input() rutProfesor!: string;
  @Input() idCurso!: number;
  @Input() idAsignatura!: number;

  displayEditarNota: boolean = false;
  datoSeleccionado: Dato | null = null;
  nuevoValor!: number;
  motivo: string = '';

  datos: Dato[] = [];
  tabs: { title: string, content: Dato[] }[] = [];

  today: string;

  mostrarPopupCrearEvaluacion: boolean = false;
  tiposEvaluacion: TipoEvaluacion[] = [
    { idTipoNota_int: 1, nombre_str: 'Evaluación' },
    { idTipoNota_int: 2, nombre_str: 'Informe' },
    { idTipoNota_int: 3, nombre_str: 'Presentación Oral' },
    { idTipoNota_int: 4, nombre_str: 'Otro' }
  ];

  formulario: Formulario = {
    idCurso: 0,
    idAsignatura: 0,
    tipoCalificacion: this.tiposEvaluacion[0],
    fechaEvaluacion: new Date(),
    ponderacion: 0,
    nombre: '',
    usuarioModificacion: ''
  };


  constructor(
    private profesoresService: ProfesoresService,
    private messageService: MessageService,
    private notaService: NotaService
  ) {
    this.today = new Date().toISOString().split('T')[0];
  }

  ngOnInit() {
    this.obtenerDatos();

    // Suscripción al evento de nota actualizada
    this.notaService.notaActualizada$.subscribe(() => {
      this.obtenerDatos();
        });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rutProfesor'] || changes['idCurso'] || changes['idAsignatura']) {
      this.obtenerDatos();
    }
  }

  obtenerDatos(): void {
    if (this.rutProfesor && this.idCurso && this.idAsignatura) {
      this.profesoresService.obtenerDetalleRegistrosNotasAsistenciaXAlumno(this.rutProfesor, this.idCurso, this.idAsignatura).subscribe(
        (data: Dato[]) => {
          this.datos = data;
          this.crearTabs();
          console.log('Datos obtenidos Detalle Alumnos:', data);
        },
        (error) => {
          console.error('Error al obtener los datos:', error);
        }
      );
    }
  }

  obtenerEstudiantesUnicos(datos: Dato[]): string[] {
    const estudiantesUnicos = [...new Set(datos.map(dato => dato.Nombre_Estudiante))];
    return estudiantesUnicos;
  }

  filtrarPorEstudiante(datos: Dato[], estudiante: string, tabTitle: string): Dato[] {
    return datos.filter(dato => dato.Nombre_Estudiante === estudiante);
  }

  crearTabs(): void {
    const groupedData = this.groupByType(this.datos);
    this.tabs = Object.keys(groupedData).map(key => ({
      title: key,
      content: groupedData[key]
    }));
  }

  groupByType(data: Dato[]): Record<string, Dato[]> {
    return data.reduce((acc: Record<string, Dato[]>, item) => {
      const key = item.Tipo.startsWith('Nota') ? 'Notas' : item.Tipo;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    }, {});
  }

  getRegistroTexto(registro: number, fecha: string): string {
    if (fecha > this.today) {
      return 'Próxima';
    }
    return registro === 5 ? 'Presente' : 'Ausente';
  }

  abrirPopupEditar(dato: Dato) {
    this.datoSeleccionado = dato;
    this.displayEditarNota = true;
    this.nuevoValor = dato.Registro;
    this.motivo = '';
  }

  cerrarPopupEditar() {
    this.displayEditarNota = false;
    this.resetFormulario();

  }

  editarNota() {
    if (!this.datoSeleccionado) {
      console.error('No hay ningún dato seleccionado para editar.');
      return;
    }

    const dato = this.datoSeleccionado;
    const regexNota = /^[1-7](\.[0-9])?$/;
    if (!regexNota.test(this.nuevoValor.toString())) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ingrese una nota válida (Ej: 5 o 5.5). Recuerde que la nota debe ser entre 1.0 a 7.0.' });
      return;
    }

    if (this.motivo.length > 100) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El motivo no puede exceder los 100 caracteres.' });
      return;
    }

    console.log('Datos a enviar:', {
      rutProfesor: this.rutProfesor,
      fecha: dato.Fecha_Registro,
      tipo: dato.Tipo,
      rutEstudiante: dato.Rut_Estudiante,
      nuevoValor: this.nuevoValor,
      motivo: this.motivo,
      idCurso: this.idCurso,
      idAsignatura: this.idAsignatura
    });

    this.profesoresService.actualizarNota(
      this.rutProfesor,
      dato.Fecha_Registro,
      dato.Tipo,
      dato.Rut_Estudiante,
      this.nuevoValor,
      this.motivo,
      this.idCurso,
      this.idAsignatura
    ).subscribe(response => {
      console.log('Datos actualizados:', response);
      this.displayEditarNota = false;
      this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Nota actualizada correctamente.' });
      this.obtenerDatos();
      this.notaService.emitirNotaActualizada(); // Emitir evento cuando se actualice la nota
    }, error => {
      console.error('Error al actualizar datos:', error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar la nota.' });
    });
  }

  abrirPopupCrearEvaluacion(): void {
    this.mostrarPopupCrearEvaluacion = true;
  }

  cerrarPopupCrearEvaluacion(): void {
    this.mostrarPopupCrearEvaluacion = false;
    this.resetFormulario();

  }

  crearEvaluacion(): void {
    const fechaformularioFormatted = this.formatDate(this.formulario.fechaEvaluacion);

    const formData = new FormData();
    formData.append('idAsignatura', this.idAsignatura.toString());
    formData.append('idCurso', this.idCurso.toString());
    formData.append('tipoCalificacion', this.formulario.tipoCalificacion.idTipoNota_int.toString()); // Aquí se envía solo el idTipoNota_int
    formData.append('fechaEvaluacion', fechaformularioFormatted);
    formData.append('ponderacion', this.formulario.ponderacion.toString());
    formData.append('nombre', this.formulario.nombre);
    formData.append('usuarioModificacion', this.rutProfesor);

    // Aquí debes continuar con la lógica para enviar formData al backend

      this.profesoresService.crearEvaluacion(formData).subscribe(
        (data) => {
          console.log('Evaluación creada:', data);
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Evaluación creada correctamente.' });
          this.cerrarPopupCrearEvaluacion();
          this.obtenerDatos();
          this.notaService.emitirNotaActualizada(); // Emitir evento cuando se actualice la nota
        },
        (error) => {
          console.error('Error al crear la evaluación:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear la evaluación.' });
        }
      );
  }



formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
}

resetFormulario(): void {
  this.idCurso = this.idCurso;
  this.idAsignatura = this.idAsignatura;
  this.formulario.tipoCalificacion = this.tiposEvaluacion[0];
  this.formulario.fechaEvaluacion = new Date;
  this.formulario.ponderacion = 0;
  this.formulario.nombre = '';
  this.formulario.usuarioModificacion = '';
}

}
