import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AlumnosAsignaturaComponent } from '../alumnos-asignatura/alumnos-asignatura.component';
import { GraficosAsignaturaComponent } from '../graficos-asignatura/graficos-asignatura.component';
import { PromediosAsignaturaComponent } from '../promedios-asignatura/promedios-asignatura.component';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { SharedService } from 'src/app/shared.service';
import { DividerModule } from 'primeng/divider';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { DetalleAsignaturaComponent } from '../detalle-asignatura/detalle-asignatura.component';
import { BotonesAsignaturaComponent } from '../botones-asignatura/botones-asignatura.component';



@Component({
  selector: 'app-moduleasignatura-dashboard-profesor',
  standalone  : true,
  imports: [
    DividerModule,
    RouterLink,
    MatIconModule,
    CommonModule,
    MatIconModule,
    RouterLink,
    AlumnosAsignaturaComponent,
    DetalleAsignaturaComponent,
    GraficosAsignaturaComponent,
    PromediosAsignaturaComponent,
    BotonesAsignaturaComponent,

  ],
  templateUrl: './moduleasignatura-dashboard-profesor.component.html',
  styleUrls: ['./moduleasignatura-dashboard-profesor.component.css']
})

export class ModuleasignaturaDashboardProfesorComponent implements OnInit {

  idCurso: any | null = null; // ID del curso
  idAsignatura: any | null = null; // ID de la asignatura
  rutProfesor: any | null = null; // Rut del profesor

  constructor(private route: ActivatedRoute, private sharedService: SharedService) {}

  ngOnInit(): void {
    // Recuperar los parámetros de la URL
    this.route.params.subscribe(params => {
      this.idCurso = +params['idCurso']; // Convertir a número si es necesario
      this.idAsignatura = +params['idAsignatura']; // Convertir a número si es necesario
      this.obtenerDatosProfesor();
    });
  }

  obtenerDatosProfesor(): void {
    // Obtener los datos del profesor del servicio compartido
    this.sharedService.getProfesorData().subscribe(profesor => {
      if (profesor) {
        this.rutProfesor = profesor.rut_str;
      } else {
        console.error('El rut del profesor no está disponible.');
      }
    });
  }

}
