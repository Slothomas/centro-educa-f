import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared.service';
import { CommonModule } from '@angular/common';
import { EstudiantesService } from 'src/app/estudiantes.service';
import { CalendarOptions } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { CardModule } from 'primeng/card';
import { FullCalendarModule } from '@fullcalendar/angular';


@Component({
  selector: 'app-horario-dashboard-student',
  standalone: true,
  imports: [CommonModule, CardModule, FullCalendarModule],
  providers: [EstudiantesService],
  templateUrl: './horario-dashboard-student.component.html',
  styleUrls: ['./horario-dashboard-student.component.css']
})

export class HorarioDashboardStudentComponent implements OnInit {
  horario: any[] = [];
  rutEstudiante: any = null;
  idCurso: any = null;

  calendarOptions: CalendarOptions = {
    plugins: [timeGridPlugin, listPlugin],
    headerToolbar: {
      left: '',
      center: '',
      right: 'timeGridDay,timeGridWeek,listWeek'

    },
    buttonText: {
      day: 'Hoy',
      week: 'Semana',
      list: 'Lista'
    },
    locale: 'es',
    views: {
      timeGridWeek: {
        dayHeaderFormat: { weekday: 'short', month: undefined, day: 'numeric', year: undefined },
        hiddenDays: [0], // Ocultar domingo (0)
        slotMinTime: '08:00:00', // Mostrar desde las 8:00 AM
        slotMaxTime: '23:00:00', // Mostrar hasta las 11:00 PM
        slotLabelFormat: { hour: 'numeric', hour12: true, hourCycle: 'h24' }, // Formato de las horas (ej. 8 AM)
      },
      timeGridDay: {
        dayHeaderFormat: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' },
        slotMinTime: '08:00:00', // Mostrar desde las 8:00 AM
        slotMaxTime: '23:00:00', // Mostrar hasta las 11:00 PM
        slotLabelFormat: { hour: 'numeric', hour12: true, hourCycle: 'h24' }, // Formato de las horas (ej. 8 AM)
      },
      listWeek: {
        dayHeaderFormat: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' },
        hiddenDays: [0] // Ocultar domingo (0)
      }
    },
    editable: false, // Deshabilitar edición de eventos
    selectable: false, // Deshabilitar selección de eventos
    events: [],
    height: 'auto' // Ajustar altura automáticamente
  };

    // Define los colores y sus significados
    legendColors = {
      grey: 'Asignatura Pasada',
      green: 'Asignatura Actual',
      blue: 'Asignatura Futura'
    };


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
        const today = new Date();
        const currentDay = today.getDay(); // Obtener el día actual (domingo = 0, lunes = 1, ..., sábado = 6)
        const currentHour = today.getHours(); // Obtener la hora actual
        const currentMinute = today.getMinutes(); // Obtener los minutos actuales

        this.horario = data.map(event => ({
          title: `${event.Nombre_Asignatura} - ${event.Lugar}`,
          startTime: event.Hora_Inicio,
          endTime: event.Hora_Fin,
          daysOfWeek: [this.convertirDiaSemana(event.Dia_Semana)],
          color: this.obtenerColorEvento(event.Dia_Semana, event.Hora_Inicio, event.Hora_Fin, currentDay, currentHour, currentMinute),
          extendedProps: {
            asignatura: event.Nombre_Asignatura,
            lugar: event.Lugar
          }
        }));

        this.calendarOptions.events = this.horario;
      },
      (error) => {
        console.error('Error al obtener el horario:', error);
      }
    );
  }



  convertirDiaSemana(diaSemana: number): number {
    // Convertimos el día de la semana al formato de FullCalendar
    // Recordar que en FullCalendar, el domingo es 0, lunes es 1, martes es 2, etc.
    // Pero en tu caso, lunes es 2, martes es 3, etc.
    return diaSemana === 1 ? 0 : diaSemana - 1;
  }

  obtenerColorEvento(diaSemana: number, horaInicio: string, horaFin: string, currentDay: number, currentHour: number, currentMinute: number): string {
    const horaInicioArray = horaInicio.split(':');
    const horaFinArray = horaFin.split(':');
    const horaInicioEvento = parseInt(horaInicioArray[0]);
    const minutoInicioEvento = parseInt(horaInicioArray[1]);
    const horaFinEvento = parseInt(horaFinArray[0]);
    const minutoFinEvento = parseInt(horaFinArray[1]);

    if (diaSemana <= currentDay ||
        (diaSemana-1 === currentDay && (horaFinEvento < currentHour || (horaFinEvento === currentHour && minutoFinEvento <= currentMinute)))) {
      return 'grey'; // Pasado
    } else if (diaSemana-1 === currentDay && horaInicioEvento <= currentHour && horaFinEvento >= currentHour) {
      return 'green'; // Actual
    } else {
      return 'blue'; // Futuro
    }
}

}







