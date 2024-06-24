import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { ProfesoresService } from 'src/app/profesores.service';

@Component({
  selector: 'app-graficos-asignatura',
  standalone: true,
  imports: [ChartModule, CommonModule],
  templateUrl: './graficos-asignatura.component.html',
  styleUrls: ['../moduleasignatura-dashboard-profesor/moduleasignatura-dashboard-profesor.component.css', './graficos-asignatura.component.css']
})
export class GraficosAsignaturaComponent implements OnChanges {

  @Input() rutProfesor!: string;
  @Input() idCurso!: number;
  @Input() idAsignatura!: number;

  dataGraficos: any[] = [];

  barChartData: any;
  barChartOptions: any;
  lineChartData: any;
  lineChartOptions: any;

  constructor(private profesoresService: ProfesoresService) {}

  ngOnInit(): void {
    this.obtenerDatosGraficos();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rutProfesor'] || changes['idCurso'] || changes['idAsignatura']) {
      this.obtenerDatosGraficos();
    }
  }

  obtenerDatosGraficos(): void {
    if (this.rutProfesor && this.idCurso && this.idAsignatura) {
      this.profesoresService.obtenerDetallePromedioNotaAsistenciaXAlumno(this.rutProfesor, this.idCurso, this.idAsignatura).subscribe(
        (data) => {
          this.dataGraficos = data;
          this.configureBarChart();
          this.configureLineChart();
        },
        (error) => {
          console.error('Error al obtener los datos:', error);
        }
      );
    }
  }

  configureBarChart(): void {
    const dataNotas = this.dataGraficos
      .filter(item => item.Tipo === 'Promedio Notas')
      .sort((a, b) => b.Promedio - a.Promedio);

    const labels = dataNotas.map(item => item.Nombre_Estudiante);
    const data = dataNotas.map(item => item.Promedio);

    this.barChartData = {
      labels: labels,
      datasets: [
        {
          type: 'bar',
          label: 'Promedio Notas',
          backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--green-500'),
          data: data,
          borderColor: 'white',
          borderWidth: 2,
          barThickness: 40
        }
      ]
    };

    this.barChartOptions = {
      indexAxis: 'y',
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--text-color')
          }
        }
      },
      scales: {
        x: {
          min: 0,
          max: 7,
          step:1,
          ticks: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--text-color-secondary')
          },
          grid: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--surface-border')
          }
        },
        y: {
          min: 0,
          max: 7,
          step:0.5,
          ticks: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--text-color-secondary')
          },
          grid: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--surface-border')
          }
        }
      }
    };
  }

  configureLineChart(): void {
    const dataAsistencias = this.dataGraficos
      .filter(item => item.Tipo === 'Promedio Asistencia')
      .sort((a, b) => b.Promedio - a.Promedio);

    const labels = dataAsistencias.map(item => item.Nombre_Estudiante);
    const data = dataAsistencias.map(item => item.Promedio);

    this.lineChartData = {
      labels: labels,
      datasets: [
        {
          label: 'Promedio Asistencia',
          borderColor: getComputedStyle(document.documentElement).getPropertyValue('--blue-500'),
          fill: true,
          tension: 0.8,
          data: data,
          backgroundColor: 'rgba(20,1417,381,0.2)'
        }
      ]
    };

    this.lineChartOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--text-color')
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--text-color-secondary')
          },
          grid: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--surface-border')
          }
        },
        y: {
          min: 0,
          max: 100,
          ticks: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--text-color-secondary')
          },
          grid: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--surface-border')
          }
        }
      }
    };
  }
}
