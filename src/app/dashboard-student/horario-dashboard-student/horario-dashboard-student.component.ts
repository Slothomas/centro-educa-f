import { Component, OnInit } from '@angular/core';
import { EstudiantesService } from '../../estudiantes.service';
import { SharedService } from 'src/app/shared.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-horario-dashboard-student',
  standalone: true,
  imports: [CommonModule],
  providers: [EstudiantesService],
  templateUrl: './horario-dashboard-student.component.html',
  styleUrls: ['./horario-dashboard-student.component.css']
})
export class HorarioDashboardStudentComponent implements OnInit {
  horario: any[] = [];
  rutEstudiante: any  = null;
  idCurso: any = null;

  constructor(
    private estudianteService: EstudiantesService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.obtenerDatosEstudiante();
  }

  obtenerDatosEstudiante(): void {
    this.sharedService.getEstudianteData().subscribe(estudiante => {
      if (estudiante) {
        this.rutEstudiante = estudiante.rut_str;
        this.idCurso = estudiante.idCurso_int;
        this.obtenerHorario(this.rutEstudiante, this.idCurso);
      } else {
        console.error('El rut del estudiante no está disponible.');
      }
    });
  }

  obtenerHorario(rutEstudiante: string, idCurso_int: number): void {
    this.estudianteService.obtenerHorario(rutEstudiante, idCurso_int).subscribe(
      (data) => {
        this.horario = data.map(event => ({
          Nombre_Asignatura: event.Nombre_Asignatura,
          Lugar: event.Lugar,
          Dia_Semana: this.obtenerNombreDiaSemana(event.Dia_Semana),
          Hora_Inicio: event.Hora_Inicio,
          Hora_Fin: event.Hora_Fin
        }));
      },
      (error) => {
        console.error('Error al obtener el horario:', error);
      }
    );
  }

  obtenerNombreDiaSemana(numeroDia: number): string {
    switch (numeroDia) {
      case 2:
        return 'Lunes';
      case 3:
        return 'Martes';
      case 4:
        return 'Miércoles';
      case 5:
        return 'Jueves';
      case 6:
        return 'Viernes';
      case 7:
        return 'Sábado';
      case 1:
        return 'Domingo';
      default:
        return '';
    }
  }
}
