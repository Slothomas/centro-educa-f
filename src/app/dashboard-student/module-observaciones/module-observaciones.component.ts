import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { EstudiantesService } from 'src/app/estudiantes.service';
import { SharedService } from 'src/app/shared.service';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { RouterLink } from '@angular/router';
import { DividerModule } from 'primeng/divider';


@Component({
  selector: 'app-module-observaciones',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    TableModule,
    InputTextModule,
    DropdownModule,
    ButtonModule,
    CardModule,
    TabViewModule,
    FormsModule,  // <-- Asegúrate de importar FormsModule
    ScrollPanelModule,
    RouterLink,
    DividerModule
  ],
  templateUrl: './module-observaciones.component.html',
  styleUrls: ['./module-observaciones.component.css']
})
export class ModuleObservacionesComponent implements OnInit {

  rutEstudiante: any | null = null;
  datos: any[] = [];
  asignaturas: string[] = [];
  tipoObservaciones: any[] = [
    { label: 'Felicitación', value: 'Felicitación' },
    { label: 'Llamado a apoderados', value: 'Llamado a apoderados' },
    { label: 'Comportamiento inadecuado', value: 'Comportamiento inadecuado' },
    { label: 'Mejora continua', value: 'Mejora continua' },
    { label: 'Amonestación', value: 'Amonestación' },
    { label: 'Incidente disciplinario', value: 'Incidente disciplinario' },
    { label: 'Rendimiento académico', value: 'Rendimiento académico' },
    { label: 'Salud', value: 'Salud' }
  ];
  busqueda: string = '';

  constructor(private sharedService: SharedService, private estudianteService: EstudiantesService) {}

  ngOnInit(): void {
    this.obtenerDatosEstudiante();
  }

  obtenerDatosEstudiante(): void {
    this.sharedService.getEstudianteData().subscribe(estudiante => {
      if (estudiante) {
        this.rutEstudiante = estudiante.rut_str;
        this.obtenerDatosObservaciones();
      } else {
        console.error('El rut del estudiante no está disponible.');
      }
    });
  }

  obtenerDatosObservaciones(): void {
    this.estudianteService.obtenerDetalleObservaciones(this.rutEstudiante).subscribe(observaciones => {
      if (observaciones) {
        this.datos = observaciones;
        this.cargarAsignaturas();
      } else {
        console.error('No hay observaciones disponibles.');
      }
    });
  }

  cargarAsignaturas() {
    this.asignaturas = [...new Set(this.datos.map(obs => obs.Nombre_Asignatura))];
  }

  filtrarObservaciones(asignatura: string) {
    return this.datos.filter(obs => {
      return obs.Nombre_Asignatura === asignatura &&
             (!this.busqueda || Object.values(obs).some((val: any) => val && val.toString().toLowerCase().includes(this.busqueda.toLowerCase())));
    });
  }

  limpiarFiltros() {
    // Aquí defines la lógica para limpiar los filtros
    this.busqueda = ''; // Por ejemplo, limpiar la búsqueda
    // También puedes limpiar otros filtros si los tienes
  }
}
