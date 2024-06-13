import { EstudiantesService } from 'src/app/estudiantes.service';
import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges, OnChanges } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';


@Component({
  selector: 'app-registros-asignatura',
  standalone: true,
  imports: [CommonModule, TabViewModule, TableModule],
  templateUrl: './registros-asignatura.component.html',
  styleUrls: ['./registros-asignatura.component.css']
})

export class RegistrosAsignaturaComponent implements OnChanges {

  @Input() rutEstudiante!: string; // Rut del estudiante
  @Input() idCurso!: number; // ID del curso
  @Input() idAsignatura!: number; // ID de la asignatura

  datos: any[] = []; // Datos de la asignatura, inicializado como array vacío
  tabs: { title: string, content: any[] }[] = [];
  today: string;

  constructor(private estudiantesService: EstudiantesService) {
    this.today = new Date().toISOString().split('T')[0]; // Fecha actual en formato 'YYYY-MM-DD'
  }

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
      this.estudiantesService.obtenerDetalleRegistrosNotasAsignaturas(this.rutEstudiante, this.idCurso, this.idAsignatura).subscribe(
        (data) => {
          console.log('Data received:', data);
          this.datos = data; // Asignar todos los datos recibidos
          this.crearTabs(); // Crear los tabs basados en los datos recibidos
        },
        (error) => {
          console.error('Error al obtener los datos:', error);
        }
      );
    }
  }

  crearTabs(): void {
    const groupedData = this.groupByType(this.datos);
    this.tabs = Object.keys(groupedData).map(key => ({
      title: key,
      content: groupedData[key]
    }));
  }

  groupByType(data: any[]): any {
    return data.reduce((acc, item) => {
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
}
