import { Component, OnInit } from '@angular/core';
import { EventosService } from '../eventos.service';
import { CommonModule } from '@angular/common';

interface Mes {
  nombre: string;
}

interface Evento {
  ID_EVENTO: number;
  MES: string;
  FECHA_EVENTO: string;
  NOMBRE_ASIGNATURA: string;
  DESCRIPCION: string;
}

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {

  eventos: Evento[] = [];
  meses: Mes[] = [];

  constructor(private eventosService: EventosService) { }

  ngOnInit(): void {
    this.fetchEventos();
  }

  fetchEventos() {
    this.eventosService.getAllEvents().subscribe(
      (data: Evento[]) => {
        this.eventos = data;

        // Extraer nombres únicos de los meses y crear objetos Mes
        this.meses = this.eventos.reduce((mesesUnicos: Mes[], evento: Evento) => {
          if (!mesesUnicos.find(mes => mes.nombre === evento.MES)) {
            mesesUnicos.push({ nombre: evento.MES });
          }
          return mesesUnicos;
        }, []);

        console.log('Eventos cargados:', this.eventos);
        console.log('Meses únicos:', this.meses);
      },
      (error) => {
        console.error('Error al cargar eventos:', error);
      }
    );
  }

  // Método para formatear la fecha
  formatFecha(fecha: string): string {
    if (!fecha) {
      return ''; // Manejo del caso donde fecha es null o undefined
    }
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
  }

}
