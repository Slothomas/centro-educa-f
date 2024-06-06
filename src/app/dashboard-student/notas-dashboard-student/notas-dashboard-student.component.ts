import { Component, OnInit } from '@angular/core';
import { EstudiantesService } from 'src/app/estudiantes.service';
import { ChartModule } from 'primeng/chart';
import { CommonModule } from '@angular/common';
import { SharedService } from './../../shared.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-notas-dashboard-student',
  standalone: true,
  imports: [ChartModule, CommonModule, FormsModule],
  templateUrl: './notas-dashboard-student.component.html',
  styleUrls: ['./notas-dashboard-student.component.css']
})
export class NotasDashboardStudentComponent implements OnInit {

  notas: any[] = [];
  asignaturas: { id: string, nombre: string }[] = [];
  selectedAsignatura: string = '';
  data: any;
  options: any;

  constructor(
    private estudiantesService: EstudiantesService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.obtenerDatosEstudiante();
    this.inicializarChartOptions();
  }

  obtenerDatosEstudiante(): void {
    this.sharedService.getEstudianteData().subscribe(estudiante => {
      if (estudiante) {
        console.log('NotasDashboardStudentComponent.obtenerDatosEstudiante - datos del estudiante:', estudiante);
        this.obtenerNotas(estudiante.rut_str, estudiante.idCurso_int);
      } else {
        console.error('El rut del estudiante no está disponible.');
      }
    });
  }

  obtenerNotas(rutEstudiante: string, idCurso: number): void {
    console.log('NotasDashboardStudentComponent.obtenerNotas - llamando al servicio con RUT y ID de Curso:', rutEstudiante, idCurso);
    this.estudiantesService.obtenerNotas(rutEstudiante, idCurso).subscribe(
      (data) => {
        this.notas = data;
        const asignaturaSet = new Set<string>();
        this.notas.forEach(nota => {
          asignaturaSet.add(nota.Nombre_Asignatura);
        });
        this.asignaturas = Array.from(asignaturaSet).map(nombre => ({
          id: nombre,
          nombre: nombre
        }));
        this.selectedAsignatura = this.asignaturas[0]?.id || '';
        this.updateChart();
      },
      (error) => {
        console.error('Error al obtener las notas:', error);
      }
    );
  }

  updateChart(): void {
    const selectedNotas = this.notas.filter(nota => nota.Nombre_Asignatura === this.selectedAsignatura);
    const labels = selectedNotas.map(nota => nota.Evaluacion);
    const notasData = selectedNotas.map(nota => nota.Nota);
    const promedioData = selectedNotas.map(nota => nota.Promedio_Evaluacion);
    const documentStyle = getComputedStyle(document.documentElement);
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');


    this.data = {
      labels: labels,
      datasets: [
        {
          type: 'line',
          label: 'Promedio del Curso',
          borderColor: documentStyle.getPropertyValue('--blue-500'),
          borderWidth: 2,
          fill: false,
          data: promedioData,
          tension: 0.6
        },
        {
          type: 'bar',
          label: 'Notas',
          backgroundColor: '#66BB6A',
          data: notasData,
          barThickness: 40,
          order: 2
        }
      ]
    };
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
          max: 7,
          stepSize: 0.5,
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
