import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedService } from 'src/app/shared.service';
import { EstudiantesService } from 'src/app/estudiantes.service';
import { ChartComponent, NgApexchartsModule, ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexPlotOptions, ApexLegend, ApexYAxis, ApexXAxis } from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  legend: ApexLegend;
  colors: string[];
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
};

@Component({
  selector: 'app-notas-dashboard-student',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  providers: [EstudiantesService],
  styleUrls: ['./notas-dashboard-student.component.css'],
  templateUrl: './notas-dashboard-student.component.html',
})
export class NotasDashboardStudentComponent implements OnInit {
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: ChartOptions;
  estudiante: any = null;
  notas: any[] = [];
  asignaturas: { id: string, nombre: string }[] = [];
  selectedAsignatura: string = '';

  constructor(private sharedService: SharedService, private estudiantesService: EstudiantesService) {
    this.chartOptions = {
      series: [],
      chart: {
        height: 350,
        type: "bar"
      },
      plotOptions: {
        bar: {
          columnWidth: "40%"  // Ancho de la barra
        }
      },
      colors: ["#00E396"],
      dataLabels: {
        enabled: false
      },
      legend: {
        show: true,
        showForSingleSeries: true,
        customLegendItems: ["Notas", "Promedio del Curso"],
        markers: {
          fillColors: ["#00E396", "#775DD0"]
        }
      },
      xaxis: {
        categories: []
      },
      yaxis: {
        min: 1,
        max: 7,
        tickAmount: 6,
        labels: {
          formatter: (val: number) => val.toFixed(1)
        },
        title: {
          text: "Notas"
        }
      }
    };
  }

  ngOnInit(): void {
    console.log('NotasDashboardStudentComponent.ngOnInit - fetching student data');
    this.sharedService.getEstudianteData().subscribe(estudiante => {
      if (estudiante) {
        console.log('NotasDashboardStudentComponent.ngOnInit - student data:', estudiante);
        this.estudiante = estudiante;
        this.estudiantesService.obtenerNotas(estudiante.rut_str, estudiante.idCurso_int).subscribe(data => {
          this.notas = data;
          console.log('NotasDashboardStudentComponent.ngOnInit - notas:', this.notas);
          const asignaturaSet = new Set<string>();
          this.notas.forEach(nota => {
            asignaturaSet.add(nota.Nombre_Asignatura);
          });
          this.asignaturas = Array.from(asignaturaSet).map(nombre => ({
            id: nombre,
            nombre: nombre
          }));
          console.log('NotasDashboardStudentComponent.ngOnInit - asignaturas:', this.asignaturas);
          this.selectedAsignatura = this.asignaturas[0]?.id || '';
          this.updateChart();
        });
      }
    });
  }

  onAsignaturaChange(event: any): void {
    this.selectedAsignatura = event.target.value;
    console.log('NotasDashboardStudentComponent.onAsignaturaChange - selectedAsignatura:', this.selectedAsignatura);
    this.updateChart();
  }

  updateChart(): void {
    if (this.selectedAsignatura) {
      const filteredNotas = this.notas.filter(nota => nota.Nombre_Asignatura === this.selectedAsignatura);
      console.log('NotasDashboardStudentComponent.updateChart - filteredNotas:', filteredNotas);
      if (filteredNotas.length > 0) {
        const categorias = filteredNotas.map(item => `${item.Evaluacion}`);
        const seriesData = filteredNotas.map(nota => ({
          x: nota.Evaluacion,
          y: nota.Nota,
          goals: [
            {
              name: "Promedio del Curso",
              value: nota.Promedio_Evaluacion,
              width: '130%',  // Abarcar el 100% de la barra
              strokeHeight: 5,  // Hacer más gruesa la marca del promedio
              strokeColor: "#775DD0"
            }
          ]
        }));

        console.log('NotasDashboardStudentComponent.updateChart - categorias:', categorias);
        console.log('NotasDashboardStudentComponent.updateChart - seriesData:', seriesData);

        this.chartOptions.series = [
          {
            name: 'Notas',
            data: seriesData
          }
        ];
        this.chartOptions.xaxis = {
          categories: categorias
        };
      } else {
        this.chartOptions.series = [];
        this.chartOptions.xaxis = {
          categories: []
        };
      }
      console.log('NotasDashboardStudentComponent.updateChart - chartOptions:', this.chartOptions);
    }
  }
}
