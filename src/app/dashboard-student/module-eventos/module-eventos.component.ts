import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { EstudiantesService } from 'src/app/estudiantes.service';
import { SharedService } from 'src/app/shared.service';
import { DividerModule } from 'primeng/divider';
import { CarouselModule } from 'primeng/carousel';
import { CardModule } from 'primeng/card';
import { PrimeNGConfig } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ImageModule } from 'primeng/image';
import { TagModule } from 'primeng/tag';


@Component({
  selector: 'app-module-eventos',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    RouterLink,
    FormsModule,
    DividerModule,
    CarouselModule,
    CardModule,
    DialogModule,
    ButtonModule,
    ToastModule,
    ConfirmDialogModule,
    ImageModule,
    TagModule
  ],
  providers: [PrimeNGConfig, ConfirmationService, MessageService],
  templateUrl: './module-eventos.component.html',
  styleUrls: ['./module-eventos.component.css']
})
export class ModuleEventosComponent implements OnInit {
  rutEstudiante: any | null = null; // Rut del estudiante
  datos: any[] = []; // Datos de los eventos, inicializado como array vacío
  misEventos: any[] = []; // Eventos del estudiante
  proximosEventos: any[] = []; // Próximos eventos
  eventosPasados: any[] = []; // Eventos pasados
  mostrarDetalles: boolean = false; // Variable para controlar la visibilidad del diálogo de detalles
  eventoSeleccionado: any | null = null; // Evento seleccionado para mostrar detalles

  responsiveOptions: any[] = [
    {
      breakpoint: '1600px',
      numVisible: 4,
      numScroll: 4,
    },
    {
      breakpoint: '1250px',
      numVisible: 3,
      numScroll: 3,
    },
    {
      breakpoint: '900px',
      numVisible: 2,
      numScroll: 2,
    },
    {
      breakpoint: '500px',
      numVisible: 1,
      numScroll: 1,
    },
  ];

  constructor(
    private sharedService: SharedService,
    private estudiantesService: EstudiantesService,
    private primengConfig: PrimeNGConfig,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.obtenerDatosEstudiante();
    this.primengConfig.ripple = true; // Habilitar efecto Ripple de PrimeNG
  }

  obtenerDatosEstudiante(): void {
    // Obtener los datos del estudiante del servicio compartido
    this.sharedService.getEstudianteData().subscribe(estudiante => {
      if (estudiante) {
        // Asignar los datos del estudiante
        this.rutEstudiante = estudiante.rut_str;
        // Obtener los datos del servicio
        this.obtenerDetalleEventos();
      } else {
        console.error('El rut del estudiante no está disponible.');
      }
    });
  }

  obtenerDetalleEventos(): void {
    // Obtener los eventos del estudiante
    this.estudiantesService.obtenerDetalleEventos(this.rutEstudiante).subscribe(eventos => {
      if (eventos) {
        // Asignar los eventos del estudiante
        this.datos = eventos;
        console.log('Eventos:', this.datos);

        // Filtrar eventos según las secciones
        const fechaActual = this.obtenerFechaActual();
        console.log('Fecha actual:', fechaActual);
        this.misEventos = this.datos.filter(evento => {
          const fechaEvento = evento.Fecha.split('T')[0];
          console.log(`Comparando fecha del evento ${fechaEvento} con fecha actual ${fechaActual}`);
          return evento.Mi_Evento === 1 && fechaEvento >= fechaActual;
        });
        this.proximosEventos = this.datos.filter(evento => {
          const fechaEvento = evento.Fecha.split('T')[0];
          console.log(`Comparando fecha del evento ${fechaEvento} con fecha actual ${fechaActual}`);
          return evento.Mi_Evento === 0 && fechaEvento >= fechaActual;
        });
        this.eventosPasados = this.datos.filter(evento => {
          const fechaEvento = evento.Fecha.split('T')[0];
          console.log(`Comparando fecha del evento ${fechaEvento} con fecha actual ${fechaActual}`);
          return evento.Mi_Evento === 1 && fechaEvento < fechaActual;
        });
      } else {
        console.error('No hay eventos disponibles.');
      }
    });
  }

  obtenerFechaActual(): string {
    const fechaActual = new Date();
    return fechaActual.toISOString().split('T')[0];
  }

  // Resto del código para ver detalles e inscribirse

  verDetalles(evento: any): void {
    // Mostrar detalles del evento seleccionado
    this.eventoSeleccionado = evento;
    this.mostrarDetalles = true;
  }

  confirmarInscripcion(evento: any): void {
    console.log('Confirmar inscripción');
    this.confirmationService.confirm({
      message: '¿Estás seguro de inscribirte en este evento?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: '',
      rejectIcon: '',
      acceptButtonStyleClass: ' p-button-success',
      rejectButtonStyleClass: ' p-button-text',
      accept: () => {
        console.log('Aceptado');
        this.inscribirse(evento); // Pasar el evento aquí
      },
      reject: () => {
        console.log('Rechazado');
        // Acciones si se rechaza la confirmación
      }
    });
  }

  inscribirse(evento: any): void {
    this.estudiantesService.inscripcionEvento(this.rutEstudiante, evento.Id_Evento).subscribe(
      () => {
        // Acciones después de inscribirse exitosamente
        this.messageService.add({ severity: 'success', summary: 'Inscripción exitosa', detail: 'Te has inscrito en el evento.' });
        this.obtenerDetalleEventos(); // Actualizar los eventos
      },
      error => {
        console.error('Error al inscribirse:', error);
        // Manejar el error aquí
      }
    );
  }

  esHoy(fecha: string): boolean {
    const fechaEvento = new Date(fecha).toISOString().split('T')[0];
    const fechaActual = this.obtenerFechaActual();
    return fechaEvento === fechaActual;
  }

}
