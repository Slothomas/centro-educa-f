import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { SharedService } from 'src/app/shared.service';
import { DetalleAsignaturaComponent } from '../detalle-asignatura/detalle-asignatura.component';
import { PromediosAsignaturaComponent } from '../promedios-asignatura/promedios-asignatura.component';
import { RegistrosAsignaturaComponent } from '../registros-asignatura/registros-asignatura.component';
import { CompanerosAsignaturaComponent } from '../companeros-asignatura/companeros-asignatura.component';
import { GraficosAsignaturaComponent } from '../graficos-asignatura/graficos-asignatura.component';


@Component({
  selector: 'app-moduleasignatura-dashboard-student',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule,
    DetalleAsignaturaComponent,
    PromediosAsignaturaComponent,
    RegistrosAsignaturaComponent,
    CompanerosAsignaturaComponent,
    GraficosAsignaturaComponent,
    CompanerosAsignaturaComponent
    ],
  templateUrl: './moduleasignatura-dashboard-student.component.html',
  styleUrls: ['./moduleasignatura-dashboard-student.component.css']
})

export class ModuleasignaturaDashboardStudentComponent implements OnInit {
  rutEstudiante: any | null = null; // Rut del estudiante
  idCurso: any | null = null; // ID del curso
  idAsignatura: any | null = null; // ID de la asignatura

  constructor(private sharedService: SharedService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Suscribirse a los cambios en los parámetros de la ruta
    this.route.paramMap.subscribe(params => {
      // Obtener el ID de la asignatura de los parámetros de la ruta
      this.idAsignatura = +params.get('id')!;
      // Obtener los datos del estudiante una vez que se cargan los parámetros de la ruta
      this.obtenerDatosEstudiante();
    });
  }

  obtenerDatosEstudiante(): void {
    // Obtener los datos del estudiante del servicio compartido
    this.sharedService.getEstudianteData().subscribe(estudiante => {
      if (estudiante) {
        // Asignar los datos del estudiante
        this.rutEstudiante = estudiante.rut_str;
        this.idCurso = estudiante.idCurso_int;
      } else {
        console.error('El rut del estudiante no está disponible.');
      }
    });
  }
}
