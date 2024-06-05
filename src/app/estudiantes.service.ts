import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EstudiantesService {
  private apiUrl = 'https://centro-educa-b.azurewebsites.net/estudiante'; // URL base
  private http = inject(HttpClient);

  // Método para obtener los datos del estudiante en base al rut ingresado en el login.
  getDatosEstudiante(rutEstudiante: string): Observable<any> {
    const endpoint = `${this.apiUrl}/datosEstudiante`; // Resto de la URL
    console.log('EstudiantesService.getDatosEstudiante - fetching data for RUT:', rutEstudiante);
    return this.http.post<any>(endpoint, { rutEstudiante_str: rutEstudiante });
  }

  // Método para obtener las asignaturas activas del estudiante. Pasando como parametro el rut y el idcurso obtenido desde el estudiantes.service
  obtenerAsignaturas(rut: string, idCurso_int: number): Observable<any> {
    const endpoint = `${this.apiUrl}/resumeAsignaturas`; // Resto de la URL
    console.log('EstudiantesService.obtenerAsignaturas - fetching subjects for RUT:', rut, 'and IDCurso:', idCurso_int);
    return this.http.post<any>(endpoint, { rutEstudiante_str: rut, idCurso_int: idCurso_int });
  }

  obtenerNotas(rut: string, idCurso_int: number): Observable<any> {
    const endpoint = `${this.apiUrl}/resumeNotas`; // Resto de la URL
    console.log('EstudiantesService.obtenerNotas - fetching subjects for RUT:', rut, 'and IDCurso:', idCurso_int);
    return this.http.post<any>(endpoint, { rutEstudiante_str: rut, idCurso_int: idCurso_int });
  }

  getProximosEventos(rut: string): Observable<any> {
    const endpoint = `${this.apiUrl}/proximosFeed`; // Resto de la URL
    console.log('EstudiantesService.getProximosEventos - fetching upcoming events for RUT:', rut);
    return this.http.post<any>(endpoint, { rutEstudiante_str: rut });
  }

  obtenerHorario(rutEstudiante: string, idCurso_int: number): Observable<any[]> {
    const endpoint = `${this.apiUrl}/resumeSemanal`; // Resto de la URL
    console.log('EstudiantesService.obtenerHorario - fetching upcoming events for RUT:', rutEstudiante, 'and IDCurso:', idCurso_int);
    return this.http.post<any>(endpoint, { rutEstudiante_str: rutEstudiante, idCurso_int: idCurso_int });

  }
}
