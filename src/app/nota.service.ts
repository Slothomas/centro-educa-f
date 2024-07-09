import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotaService {
  private notaActualizadaSource = new Subject<void>();

  notaActualizada$ = this.notaActualizadaSource.asObservable();

  emitirNotaActualizada() {
    this.notaActualizadaSource.next();
  }
}
