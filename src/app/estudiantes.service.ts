import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EstudiantesService {
  private apiUrl = 'http://127.0.0.1:8000/estudiante/datosEstudiante'; // Cambia esto por tu URL
  private http = inject(HttpClient);

  getDatosEstudiante(rutEstudiante: string): Observable<any> {
    console.log('EstudiantesService.getDatosEstudiante - fetching data for RUT:', rutEstudiante);
    // Cambiar de GET a POST y enviar el parámetro en el cuerpo de la solicitud
    return this.http.post<any>(this.apiUrl, { rutEstudiante_str: rutEstudiante });
  }
}
