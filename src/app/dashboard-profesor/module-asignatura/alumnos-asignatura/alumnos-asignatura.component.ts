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
import { DynamicDialogRef } from 'primeng/dynamicdialog'; // Importa la referencia al dialog dinámico
import { DialogService } from 'primeng/dynamicdialog'; // Importa el servicio para manejar el dialog dinámico
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FormsModule } from '@angular/forms';

interface Dato {
  ID_Asignatura: number;
  Nombre_Asignatura: string;
  Rut_Estudiante: string;
  Nombre_Estudiante: string;
  Fecha_Registro: string;
  Registro: number;
  Tipo: string;
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
    FormsModule
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

  constructor(
    private profesoresService: ProfesoresService,
    private messageService: MessageService,
  ) {
    this.today = new Date().toISOString().split('T')[0]; // Fecha actual en formato 'YYYY-MM-DD'
  }

  ngOnInit() {
    // Inicialmente, obtén los datos cuando el componente se inicie
    this.obtenerDatos();
  }
  ngOnChanges(changes: SimpleChanges): void {
    // Detecta cambios en las entradas (rutProfesor, idCurso, idAsignatura) y vuelve a cargar los datos
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
    this.nuevoValor = dato.Registro; // Cargar el valor actual de la nota para editar
    this.motivo = ''; // Limpiar el motivo
  }

  cerrarPopupEditar() {
    this.displayEditarNota = false;
  }

  editarNota() {
    if (!this.datoSeleccionado) {
      console.error('No hay ningún dato seleccionado para editar.');
      return;
    }

    const dato = this.datoSeleccionado;

    // Validar formato y rango de la nuevo valor
    const regexNota = /^[1-7](\.[0-9])?$/; // Formato '1' o '1.5' hasta '7'
    if (!regexNota.test(this.nuevoValor.toString())) { // Convertir this.nuevoValor a string para la validación
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ingrese una nota válida (Ej: 5 o 5.5). Recuerde que la nota debe ser entre 1.0 a 7.0.' });
      return;
    }

    // Validar longitud del motivo
    if (this.motivo.length > 100) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El motivo no puede exceder los 100 caracteres.' });
      return;
    }

    // Imprimir los datos antes de enviarlos al servicio
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

    // Llama al servicio para actualizar la nota
    this.profesoresService.actualizarNota(
      this.rutProfesor,
      dato.Fecha_Registro,
      dato.Tipo,
      dato.Rut_Estudiante,
      this.nuevoValor, // Convertir this.nuevoValor a string para la llamada al servicio
      this.motivo,
      this.idCurso,
      this.idAsignatura
    ).subscribe(response => {
      console.log('Datos actualizados:', response);
      this.displayEditarNota = false; // Cerrar popup de edición de nota
      this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Nota actualizada correctamente.' });
      this.obtenerDatos(); // Recargar datos después de actualizar la nota
    }, error => {
      console.error('Error al actualizar datos:', error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar la nota.' });
    });
  }


}



