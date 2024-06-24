import { ProfesoresService } from 'src/app/profesores.service';
import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared.service';
import { CommonModule } from '@angular/common';
import { CalendarOptions } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { CardModule } from 'primeng/card';
import { FullCalendarModule } from '@fullcalendar/angular';

interface HorarioEvent {
  Bloque: number;
  Hora_Inicio: string;
  Hora_Fin: string;
  Dia_Semana: number;
  Curso: string;
  Nombre_Asignatura: string;
  Lugar: string;
}

@Component({
  selector: 'app-horario-dashboard-profesor',
  standalone: true,
  imports: [CommonModule, CardModule, FullCalendarModule],
  providers: [ProfesoresService],
  templateUrl: './horario-dashboard-profesor.component.html',
  styleUrls: ['./horario-dashboard-profesor.component.css']
})
export class HorarioDashboardProfesorComponent implements OnInit {

  horario: any[] = [];
  rutProfesor: any = null;

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
        slotLabelFormat: { hour: 'numeric', hour12: true, hourCycle: 'h24' } // Formato de las horas (ej. 8 AM)
      },
      timeGridDay: {
        dayHeaderFormat: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' },
        slotMinTime: '08:00:00', // Mostrar desde las 8:00 AM
        slotMaxTime: '23:00:00', // Mostrar hasta las 11:00 PM
        slotLabelFormat: { hour: 'numeric', hour12: true, hourCycle: 'h24' } // Formato de las horas (ej. 8 AM)
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
    private profesoresService: ProfesoresService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.obtenerDatosProfesor();
  }

  obtenerDatosProfesor(): void {
    this.sharedService.getProfesorData().subscribe(profesor => {
      if (profesor) {
        this.rutProfesor = profesor.rut_str;
        this.resumeSemanal(this.rutProfesor);
      } else {
        console.error('El rut del profesor no está disponible.');
      }
    });
  }

  resumeSemanal(rutProfesor: string): void {
    this.profesoresService.resumeSemanal(rutProfesor).subscribe(
      (data: HorarioEvent[]) => {
        const today = new Date();
        const currentDay = today.getDay(); // Obtener el día actual (domingo = 0, lunes = 1, ..., sábado = 6)
        const currentHour = today.getHours(); // Obtener la hora actual
        const currentMinute = today.getMinutes(); // Obtener los minutos actuales

        this.horario = data.map(event => ({
          title: `${event.Curso} - ${event.Nombre_Asignatura} - ${event.Lugar}`,
          startTime: event.Hora_Inicio,
          endTime: event.Hora_Fin,
          daysOfWeek: [this.convertirDiaSemana(event.Dia_Semana)],
          color: this.obtenerColorEvento(event.Dia_Semana, event.Hora_Inicio, event.Hora_Fin, currentDay, currentHour, currentMinute),
          extendedProps: {
            asignatura: event.Nombre_Asignatura,
            lugar: event.Lugar,
            curso: event.Curso,
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
