import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {

  private apiUrl = 'https://centro-educa-back.azurewebsites.net/estudiante';

  constructor(private http: HttpClient) { }

  obtenerAsignaturas(rutEstudiante: string): Observable<any> {
    const url = `${this.apiUrl}/resumeAsignaturas`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { rutEstudiante_str: rutEstudiante };
    return this.http.post(url, body, { headers });
  }
}
