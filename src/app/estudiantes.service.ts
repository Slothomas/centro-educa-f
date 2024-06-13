import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EstudiantesService {
  private apiUrl = 'https://centro-educa-back.azurewebsites.net/estudiante'; // URL base
  //'https://centro-educa-back.azurewebsites.net/estudiante';
  // Inyectamos el HttpClient en el constructor
  constructor(private http: HttpClient) {}

  // Método para obtener los datos del estudiante en base al rut ingresado en el login.
  getDatosEstudiante(rutEstudiante: string): Observable<any> {
    const endpoint = `${this.apiUrl}/datosEstudiante`; // Resto de la URL
    console.log('EstudiantesService.getDatosEstudiante - fetching data for RUT:', rutEstudiante);
    return this.http.post<any>(endpoint, { rutEstudiante_str: rutEstudiante });
  }

  // Método para obtener las asignaturas activas del estudiante.
  obtenerAsignaturas(rut: string, idCurso_int: number): Observable<any> {
    const endpoint = `${this.apiUrl}/resumeAsignaturas`; // Resto de la URL
    console.log('EstudiantesService.obtenerAsignaturas - fetching subjects for RUT:', rut, 'and IDCurso:', idCurso_int);
    return this.http.post<any>(endpoint, { rutEstudiante_str: rut, idCurso_int: idCurso_int });
  }

  // Método para obtener las notas del estudiante.
  obtenerNotas(rut: string, idCurso_int: number): Observable<any> {
    const endpoint = `${this.apiUrl}/resumeNotas`; // Resto de la URL
    console.log('EstudiantesService.obtenerNotas - fetching subjects for RUT:', rut, 'and IDCurso:', idCurso_int);
    return this.http.post<any>(endpoint, { rutEstudiante_str: rut, idCurso_int: idCurso_int });
  }

  // Método para obtener los próximos eventos del estudiante.
  getProximosEventos(rut: string): Observable<any> {
    const endpoint = `${this.apiUrl}/proximosFeed`; // Resto de la URL
    console.log('EstudiantesService.getProximosEventos - fetching upcoming events for RUT:', rut);
    return this.http.post<any>(endpoint, { rutEstudiante_str: rut });
  }

  // Método para obtener el horario del estudiante.
  obtenerHorario(rutEstudiante: string, idCurso_int: number): Observable<any[]> {
    const endpoint = `${this.apiUrl}/resumeSemanal`; // Resto de la URL
    console.log('EstudiantesService.obtenerHorario - fetching upcoming events for RUT:', rutEstudiante, 'and IDCurso:', idCurso_int);
    return this.http.post<any>(endpoint, { rutEstudiante_str: rutEstudiante, idCurso_int: idCurso_int });
  }

  //METODOS PARA EL MODULO ASIGNATURA.

  // Método para obtener los detalles de una asignatura.
  obtenerDetalleAsignatura(rutEstudiante: string, idCurso_int: number, idAsignatura_int: number): Observable<any> {
    const endpoint = `${this.apiUrl}/detalleAsignatura`; // Resto de la URL
    console.log('EstudiantesService.obtenerDetalleAsignatura - fetching details for RUT:', rutEstudiante, 'IDCurso:', idCurso_int, 'IDAsignatura:', idAsignatura_int);
    return this.http.post<any>(endpoint, { rutEstudiante_str: rutEstudiante, idCurso_int: idCurso_int, idAsignatura_int: idAsignatura_int });
  }

    // Método para obtener los detalles de los promedios de la asignaruta (promedio general ponderado y porcxentaje de asistencia
    obtenerDetallePromedioNotaAsistencia(rutEstudiante: string, idCurso_int: number, idAsignatura_int: number): Observable<any> {
      const endpoint = `${this.apiUrl}/detallePromedioNotaAsistencia`; // Resto de la URL
      console.log('EstudiantesService.obtenerDetalldPromedioNotaAsistencia - fetching details for RUT:', rutEstudiante, 'IDCurso:', idCurso_int, 'IDAsignatura:', idAsignatura_int);
      return this.http.post<any>(endpoint, { rutEstudiante_str: rutEstudiante, idCurso_int: idCurso_int, idAsignatura_int: idAsignatura_int });
    }

    // Método para obtener los detalles de los registros de notas de la asignatura.
    obtenerDetalleRegistrosNotasAsignaturas(rutEstudiante: string, idCurso_int: number, idAsignatura_int: number): Observable<any> {
      const endpoint = `${this.apiUrl}/detalleRegistrosNotasAsignaturas`; // Resto de la URL
      console.log('EstudiantesService.detalleRegistrosNotasAsignaturas - fetching details for RUT:', rutEstudiante, 'IDCurso:', idCurso_int, 'IDAsignatura:', idAsignatura_int);
      return this.http.post<any>(endpoint, { rutEstudiante_str: rutEstudiante, idCurso_int: idCurso_int, idAsignatura_int: idAsignatura_int });
    }

    obtenerDetallePromedioAsignaturas(rutEstudiante: string, idCurso_int: number): Observable<any> {
      const endpoint = `${this.apiUrl}/detallePromedioAsignaturas`; // Resto de la URL
      console.log('EstudiantesService.detallePromedioAsignaturas - fetching details for RUT:', rutEstudiante, 'IDCurso:', idCurso_int);
      return this.http.post<any>(endpoint, { rutEstudiante_str: rutEstudiante, idCurso_int: idCurso_int });
    }

    obtenerDetalleNota(rutEstudiante: string, idCurso_int: number, idAsignatura_int: number): Observable<any> {
      const endpoint = `${this.apiUrl}/detalleNotas`; // Resto de la URL
      console.log('EstudiantesService.detalleNota - fetching details for RUT:', rutEstudiante, 'IDCurso:', idCurso_int, 'IDAsignatura:', idAsignatura_int);
      return this.http.post<any>(endpoint, { rutEstudiante_str: rutEstudiante, idCurso_int: idCurso_int, idAsignatura_int: idAsignatura_int });
    }

    obtenerDetalleCompaneros(rutEstudiante: string, idCurso_int: number, idAsignatura_int: number): Observable<any> {
      const endpoint = `${this.apiUrl}/detalleCompaneros`; // Resto de la URL
      console.log('EstudiantesService.detalleCompaneros - fetching details for RUT:', rutEstudiante, 'IDCurso:', idCurso_int, 'IDAsignatura:', idAsignatura_int);
      return this.http.post<any>(endpoint, { rutEstudiante_str: rutEstudiante, idCurso_int: idCurso_int, idAsignatura_int: idAsignatura_int });
    }

    //METODOS PARA EL MODULO EVENTOS.

    obtenerDetalleEventos(rutEstudiante: string): Observable<any> {
      const endpoint = `${this.apiUrl}/detalleEventos`; // Resto de la URL
      console.log('EstudiantesService.detalleEvento - fetching details for RUT:', rutEstudiante);
      return this.http.post<any>(endpoint, { rutEstudiante_str: rutEstudiante });
    }


    //METODOS PARA EL MODULO OBSERVACIONES.
    obtenerDetalleObservaciones(rutEstudiante: string): Observable<any> {
      const endpoint = `${this.apiUrl}/detalleObservaciones`; // Resto de la URL
      console.log('EstudiantesService.detalleObservaciones - fetching details for RUT:', rutEstudiante);
      return this.http.post<any>(endpoint, { rutEstudiante_str: rutEstudiante });
    }


}
