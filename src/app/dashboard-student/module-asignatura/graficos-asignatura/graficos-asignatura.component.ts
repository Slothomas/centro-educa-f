import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { EstudiantesService } from 'src/app/estudiantes.service';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-graficos-asignatura',
  standalone: true,
  templateUrl: './graficos-asignatura.component.html',
  styleUrls: ['../moduleasignatura-dashboard-student/moduleasignatura-dashboard-student.component.css','./graficos-asignatura.component.css'],
  imports: [ChartModule]
})
export class GraficosAsignaturaComponent implements OnChanges {

  @Input() rutEstudiante!: string;
  @Input() idCurso!: number;
  @Input() idAsignatura!: number;

  dataGrafico1: any[] = [];
  dataGrafico2: any[] = [];

  barChartData: any;
  barChartOptions: any;
  polarAreaChartData: any;
  polarAreaChartOptions: any;

  constructor(private estudianteService: EstudiantesService) {}

  ngOnInit(): void {
    this.obtenerDatosGrafico1();
    this.obtenerDatosGrafico2();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rutEstudiante'] || changes['idCurso'] || changes['idAsignatura']) {
      this.obtenerDatosGrafico1();
      this.obtenerDatosGrafico2();
    }
  }

  obtenerDatosGrafico1(): void {
    if (this.rutEstudiante && this.idCurso && this.idAsignatura) {
      this.estudianteService.obtenerDetalleNota(this.rutEstudiante, this.idCurso, this.idAsignatura).subscribe(
        (data) => {
          this.dataGrafico1 = data;
          this.configureBarChart();
        },
        (error) => {
          console.error('Error al obtener los datos:', error);
        }
      );
    }
  }

  obtenerDatosGrafico2(): void {
    if (this.rutEstudiante && this.idCurso) {
      this.estudianteService.obtenerDetallePromedioAsignaturas(this.rutEstudiante, this.idCurso).subscribe(
        (data) => {
          this.dataGrafico2 = data;
          this.configurePolarAreaChart();
        },
        (error) => {
          console.error('Error al obtener los datos:', error);
        }
      );
    }
  }

  configureBarChart(): void {
    const labels = this.dataGrafico1.map(item => item.Evaluacion);
    const data = this.dataGrafico1.map(item => item.Nota);
    const promedio = this.dataGrafico1.map(nota => nota.Promedio_Evaluacion);


    this.barChartData = {
      labels: labels,
      datasets: [
        {
          type: 'line',
          label: 'Promedio del Curso',
          borderColor: getComputedStyle(document.documentElement).getPropertyValue('--blue-500'),
          borderWidth: 2,
          fill: false,
          tension: 0.6,
          data: promedio
        },
        {
          type: 'bar',
          label: 'Notas',
          backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--green-500'),
          data: data,
          borderColor: 'white',
          borderWidth: 2,
          barThickness: 40,
        }
      ]
    };

    this.barChartOptions = {
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
          min: 1.0,
          max: 7.0,
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

  configurePolarAreaChart(): void {
    const labels = this.dataGrafico2.map(item => item.Nombre_Asignatura);
    const data = this.dataGrafico2.map(item => item.Registro);

    this.polarAreaChartData = {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: [
            getComputedStyle(document.documentElement).getPropertyValue('--red-500'),
            getComputedStyle(document.documentElement).getPropertyValue('--green-500'),
            getComputedStyle(document.documentElement).getPropertyValue('--yellow-500'),
            getComputedStyle(document.documentElement).getPropertyValue('--orange-500'),
            getComputedStyle(document.documentElement).getPropertyValue('--blue-500'),
            getComputedStyle(document.documentElement).getPropertyValue('--purple-500')
          ],
          label: 'Promedio Notas'
        }
      ]
    };

    this.polarAreaChartOptions = {
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
        r: {
          grid: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--surface-border')
          }
        }
      }
    };
  }
}
