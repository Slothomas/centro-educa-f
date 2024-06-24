import { Component, OnInit } from '@angular/core';
import { ProfesoresService } from 'src/app/profesores.service';
import { ChartModule } from 'primeng/chart';
import { CommonModule } from '@angular/common';
import { SharedService } from '../../../shared.service';
import { FormsModule } from '@angular/forms';

interface Nota {
  ID_Curso: number;
  ID_Asignatura: number;
  Nombre_Curso: string;
  Nombre_Asignatura: string;
  Promedio_Nota: number;
  Porcentaje_Asistencia: number;
}

@Component({
  selector: 'app-notas-dashboard-profesor',
  standalone: true,
  imports: [ChartModule, CommonModule, FormsModule],
  templateUrl: './notas-dashboard-profesor.component.html',
  styleUrls: ['./notas-dashboard-profesor.component.css']
})
export class NotasDashboardProfesorComponent implements OnInit {

  notas: Nota[] = [];
  cursos: { id: number, nombre: string }[] = [];
  selectedCurso: number = 0;
  data: any;
  options: any;
  datasets: { [key: number]: { labels: string[], notasData: number[], asistenciaData: number[] } } = {};

  constructor(
    private profesoresService: ProfesoresService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    console.log('Componente NotasDashboardProfesor iniciado.');
    this.obtenerDatosProfesor();
    this.inicializarChartOptions();
  }

  obtenerDatosProfesor(): void {
    console.log('Obteniendo datos del profesor...');
    this.sharedService.getProfesorData().subscribe(profesor => {
      if (profesor) {
        console.log('Datos del profesor obtenidos:', profesor);
        this.resumeNotas(profesor.rut_str);
      } else {
        console.error('El rut del profesor no está disponible.');
      }
    });
  }

  resumeNotas(rutProfesor: string): void {
    console.log('Resumiendo notas del profesor con RUT:', rutProfesor);
    this.profesoresService.resumeNotas(rutProfesor).subscribe(
      (data: Nota[]) => {
        console.log('Notas obtenidas:', data);
        this.notas = data;

        const cursoSet = new Set<number>();
        this.notas.forEach(nota => {
          cursoSet.add(nota.ID_Curso);
        });

        this.cursos = Array.from(cursoSet).map(id => ({
          id: id,
          nombre: this.notas.find(nota => nota.ID_Curso === id)?.Nombre_Curso || ''
        }));

        console.log('Cursos obtenidos:', this.cursos);

        this.createDatasets();

        this.selectedCurso = this.cursos[0]?.id || 0;
        console.log('Curso seleccionado inicialmente:', this.selectedCurso);

        this.updateChart();
      },
      (error) => {
        console.error('Error al obtener las notas:', error);
      }
    );
  }

  createDatasets(): void {
    this.datasets = {};  // Asegurarse de que los datasets estén vacíos antes de empezar

    this.notas.forEach(nota => {
      if (!this.datasets[nota.ID_Curso]) {
        this.datasets[nota.ID_Curso] = { labels: [], notasData: [], asistenciaData: [] };
      }

      // Verificar si la asignatura ya ha sido añadida
      if (!this.datasets[nota.ID_Curso].labels.includes(nota.Nombre_Asignatura)) {
        this.datasets[nota.ID_Curso].labels.push(nota.Nombre_Asignatura);
        this.datasets[nota.ID_Curso].notasData.push(nota.Promedio_Nota);
        this.datasets[nota.ID_Curso].asistenciaData.push(nota.Porcentaje_Asistencia / 10); // Convertir asistencia
      }
    });

    console.log('Datasets creados:', this.datasets);
  }

  updateChart(): void {
    console.log('Actualizando gráfico para el curso seleccionado:', this.selectedCurso);

    const dataset = this.datasets[this.selectedCurso];
    if (dataset) {
      const documentStyle = getComputedStyle(document.documentElement);

      console.log('Datos para el gráfico:');
      console.log('Labels:', dataset.labels);
      console.log('Notas:', dataset.notasData);
      console.log('Asistencia:', dataset.asistenciaData);

      this.data = {
        labels: dataset.labels,
        datasets: [
          {
            type: 'bar',
            label: 'Promedio de Notas',
            backgroundColor: '#66BB6A',
            data: dataset.notasData,
            barThickness: 40,
            order: 2
          },
          {
            type: 'line',
            label: 'Porcentaje de Asistencia',
            borderColor: documentStyle.getPropertyValue('--blue-500'),
            borderWidth: 2,
            fill: false,
            data: dataset.asistenciaData,
            tension: 0.4,
            order: 1
          }
        ]
      };
    }
  }

  inicializarChartOptions(): void {
    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: '#495057',
            font: {
              size: 16
            }
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#495057',
            font: {
              size: 14
            }
          },
          grid: {
            color: '#ebedef'
          }
        },
        y: {
          min: 1,
          max: 10,
          ticks: {
            color: '#495057',
            font: {
              size: 16
            }
          },
          grid: {
            color: '#ebedef'
          }
        }
      },
      layout: {
        padding: {
          left: 10,
          right: 10,
          top: 10,
          bottom: 10
        }
      }
    };
  }
}
