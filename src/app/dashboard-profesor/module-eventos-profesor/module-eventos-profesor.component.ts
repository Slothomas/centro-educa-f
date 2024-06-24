import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
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
import { ProfesoresService } from 'src/app/profesores.service';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { CalendarModule } from 'primeng/calendar';


@Component({
  selector: 'app-module-eventos-profesor',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink, FormsModule,
    DividerModule,
    CarouselModule,
    CardModule,
    DialogModule,
    ButtonModule,
    ToastModule,
    ConfirmDialogModule,
    ImageModule,
    DropdownModule,
    FileUploadModule,
    CalendarModule
  ],
  providers: [PrimeNGConfig, ConfirmationService, MessageService],
  templateUrl: './module-eventos-profesor.component.html',
  styleUrls: ['./module-eventos-profesor.component.css']
})

export class ModuleEventosProfesorComponent implements OnInit {

  // Atributos del componente
  rutProfesor: any | null = null;
  datos: any[] = [];
  misEventos: any[] = [];
  proximosEventos: any[] = [];
  eventosPasados: any[] = [];
  mostrarDetalles: boolean = false;
  eventoSeleccionado: any | null = null;
  mostrarPopupCrearEvento: boolean = false;

  tiposEventos: any[] = [
    { id: 1, nombre: 'Concurso' },
    { id: 2, nombre: 'Charla' },
    { id: 3, nombre: 'Proyección de Cine' },
    { id: 4, nombre: 'Taller' },
    { id: 5, nombre: 'Exposición' },
    { id: 6, nombre: 'Visita' },
    { id: 7, nombre: 'Debate' },
    { id: 8, nombre: 'Conferencia' }
  ];

  asignaturas: any[] = [];

  evento: any = {
    tipoEvento: null,
    asignatura: null,
    descripcion: '',
    fechaEvento: '',
    lugarEvento: ''
  };


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

  imagenEvento: File | null = null;

  constructor(
    private sharedService: SharedService,
    private profesoresService: ProfesoresService,
    private primengConfig: PrimeNGConfig,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.obtenerDatosProfesor();
    this.primengConfig.ripple = true;

  }

  obtenerDatosProfesor(): void {
    this.sharedService.getProfesorData().subscribe(profesor => {
      if (profesor) {
        this.rutProfesor = profesor.rut_str;
        this.obtenerDetalleEventos();
        this.obtenerAsignaturasProfesor();
      } else {
        console.error('El rut del profesor no está disponible.');
      }
    });
  }

  obtenerDetalleEventos(): void {
    this.profesoresService.obtenerDetalleEventos(this.rutProfesor).subscribe(eventos => {
      if (eventos) {
        this.datos = eventos;
        const fechaActual = new Date();
        const fechaActualStr = this.formatDate(fechaActual);

        this.misEventos = this.datos.filter(evento => evento.Fecha === fechaActualStr);
        this.proximosEventos = this.datos.filter(evento => new Date(evento.Fecha) > fechaActual);
        this.eventosPasados = this.datos.filter(evento => new Date(evento.Fecha) < fechaActual);

      } else {
        console.error('No hay eventos disponibles.');
      }
    });
  }

  obtenerAsignaturasProfesor(): void {
    this.profesoresService.obtenerAsignaturas(this.rutProfesor).subscribe(asignaturas => {
      if (asignaturas) {
        this.asignaturas = asignaturas.map((asignatura: any) => ({ id: asignatura.idAsignatura_int, nombre: asignatura.nombre_str }));
      } else {
        console.error('No hay asignaturas disponibles para el profesor.');
      }
    });
  }

  verDetalles(evento: any): void {
    this.eventoSeleccionado = evento;
    this.mostrarDetalles = true;
  }

  abrirPopupCrearEvento(): void {
    this.mostrarPopupCrearEvento = true;
  }

  cerrarPopupCrearEvento(): void {
    this.mostrarPopupCrearEvento = false;
    this.resetEvento();
  }

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      this.imagenEvento = event.target.files[0];
    }
  }

  crearEvento(): void {
    if (this.evento.tipoEvento && this.evento.asignatura && this.evento.descripcion && this.evento.fechaEvento && this.evento.lugarEvento) {

      const fechaEventoFormatted = this.formatDate(this.evento.fechaEvento);


      const formData = new FormData();
      formData.append('idAsignatura_int', this.evento.asignatura.id);
      formData.append('idTipoEvento_int', this.evento.tipoEvento.id);
      formData.append('descripcion', this.evento.descripcion);
      formData.append('rutProfesor_str', this.rutProfesor);
      formData.append('fechaEvento_dat', fechaEventoFormatted); // Fecha formateada
      formData.append('lugarEvento_str', this.evento.lugarEvento);

      if (this.imagenEvento) {
        formData.append('imagenEvento', this.imagenEvento, this.imagenEvento.name);
      }

      this.profesoresService.crearEvento(formData).subscribe(
        (response: any) => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Evento creado correctamente.' });
          this.cerrarPopupCrearEvento();
          this.obtenerDetalleEventos();
        },
        (error: any) => {
          console.error('Error al crear evento:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el evento.' });
        }
      );
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Todos los campos son obligatorios.' });
    }
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  resetEvento(): void {
    this.evento = {
      tipoEvento: null,
      asignatura: null,
      descripcion: '',
      fechaEvento: '',
      lugarEvento: ''
    };
    this.imagenEvento = null;
  }


}
