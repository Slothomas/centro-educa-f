import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfesoresService {
  private apiUrl = 'https://centro-educa-back.azurewebsites.net/profesor';
  //'http://127.0.0.1:8000/profesor/getAllTeachers'; // Cambia esta URL si es necesario
    //
  constructor(private http: HttpClient) {}

  getAllTeachers(): Observable<any> {
    const endpoint = `${this.apiUrl}/getAllTeachers`;
    return this.http.get<any>(endpoint);
  }

  getDatosProfesor(rut: string): Observable<any> {
    const endpoint = `${this.apiUrl}/datosProfesor`; // Resto de la URL
    console.log('ProfesoresSerivce.getDaotsProfesor - fetching data for RUT:', rut);
    return this.http.post<any>(endpoint, { rutProfesor_str: rut });
  }

  resumeAsignaturas(rut: string): Observable<any> {
    const endpoint = `${this.apiUrl}/resumeAsignaturas`;
    console.log('ProfesoresSerivce.resumenAsignaturas - fetching data for RUT:', rut);
    return this.http.post<any>(endpoint, { rutProfesor_str: rut });
  }

  resumeSemanal(rut: string): Observable<any> {
    const endpoint = `${this.apiUrl}/resumeSemanal`;
    console.log('ProfesoresSerivce.resumenSemanal - fetching data for RUT:', rut);
    return this.http.post<any>(endpoint, { rutProfesor_str: rut });
  }

  resumeNotas(rut: string): Observable<any> {
    const endpoint = `${this.apiUrl}/resumeNotas`;
    console.log('ProfesoresSerivce.resumenNotas - fetching data for RUT:', rut);
    return this.http.post<any>(endpoint, { rutProfesor_str: rut });
  }

  resumeProximos(rut: string): Observable<any> {
    const endpoint = `${this.apiUrl}/resumeProximos`;
    console.log('ProfesoresSerivce.resumenProximos - fetching data for RUT:', rut);
    return this.http.post<any>(endpoint, { rutProfesor_str: rut });
  }

  //METODOS PARA EL MODULO ASIGNATURA

  obtenerDetalleAsignatura(rut: string, idCurso: number, idAsignatura: number): Observable<any> {
    const endpoint = `${this.apiUrl}/detalleAsignatura`;
    console.log('ProfesoresSerivce.obtenerDetalleAsignatura - fetching data for RUT:', rut);
    return this.http.post<any>(endpoint, { rutProfesor_str: rut, idCurso_int: idCurso, idAsignatura_int: idAsignatura });
  }

  obtenerDetallePromedioNotaAsistencia(rut: string, idCurso: number, idAsignatura: number): Observable<any> {
    const endpoint = `${this.apiUrl}/detallePromedioNotaAsistencia`;
    console.log('ProfesoresSerivce.obtenerDetallePromedioNotaAsistencia - fetching data for RUT:', rut);
    return this.http.post<any>(endpoint, { rutProfesor_str: rut, idCurso_int: idCurso, idAsignatura_int: idAsignatura });
  }

  obtenerDetallePromedioNotaAsistenciaXAlumno(rut: string, idCurso: number, idAsignatura: number): Observable<any> {
    const endpoint = `${this.apiUrl}/detallePromedioNotaAsistenciaXAlumno`;
    console.log('ProfesoresSerivce.obtenerDetallePromedioNotaAsistenciaXAlumno - fetching data for RUT:', rut);
    return this.http.post<any>(endpoint, { rutProfesor_str: rut, idCurso_int: idCurso, idAsignatura_int: idAsignatura });
  }

  obtenerDetalleRegistrosNotasAsistenciaXAlumno(rut: string, idCurso: number, idAsignatura: number): Observable<any> {
    const endpoint = `${this.apiUrl}/detalleRegistrosNotasAsistenciaXAlumno`;
    console.log('ProfesoresSerivce.obtenerDetalleRegistrosNotasAsistenciaXAlumno - fetching data for RUT:', rut);
    return this.http.post<any>(endpoint, { rutProfesor_str: rut, idCurso_int: idCurso, idAsignatura_int: idAsignatura });
  }

  obtenerLista(idCurso: number, idAsignatura: number): Observable<any> {
    const endpoint = `${this.apiUrl}/obtenerLista`;
    console.log('ProfesoresSerivce.obtenerLista - fetching data for ID Curso:', idCurso, 'ID Asignatura:', idAsignatura);
    return this.http.post<any>(endpoint, { idCurso_int: idCurso, idAsignatura_int: idAsignatura });
  }


      //Metodo para modificar datos
  actualizarNota(rutProfesor: string, fecha: string, nombre: string, rutEstudiante: string, valor: number, motivo_str: string, idCurso_int : number, idAsignatura_int: number): Observable<any> {
    const endpoint = `${this.apiUrl}/actualizarNota`;

    // Convierte la fecha a un formato aceptado por tu backend, por ejemplo ISO string

    // Prepara el cuerpo de la solicitud
    const body = {
      rutProfesor_str: rutProfesor,
      fecha_dat: fecha,
      nombre_str: nombre,
      rutEstudiante_str: rutEstudiante,
      valor_flo: valor,
      motivo_str: motivo_str,
      idCurso_int : idCurso_int,
      idAsignatura_int : idAsignatura_int
    };

    // Realiza la solicitud POST al endpoint correspondiente
      return this.http.put<any>(endpoint, body);
    }

    crearEvaluacion(formData: FormData): Observable<any> {
      const endpoint = `${this.apiUrl}/crearEvaluacion`;
      console.log('ProfesoresSerivce.crearEvaluacion - sending data:', formData);
      return this.http.post<any>(endpoint, formData);
    }


    //PARA EL MODULO DE EVENTOS
    obtenerDetalleEventos(rut: string): Observable<any> {
      const endpoint = `${this.apiUrl}/detalleEventos`;
      console.log('ProfesoresSerivce.obtenerDetalleEventos - fetching data for RUT:', rut);
      return this.http.post<any>(endpoint, { rutProfesor_str: rut });
    }

    obtenerAsignaturas(rut: string): Observable<any> {
      const endpoint = `${this.apiUrl}/asignaturasProfesor`;
      console.log('ProfesoresSerivce.obtenerAsignaturas - fetching data for RUT:', rut);
      return this.http.post<any>(endpoint, { rutProfesor_str: rut });
    }

    crearEvento(formData: FormData): Observable<any> {
      const endpoint = `${this.apiUrl}/crearEvento`;
      return this.http.post<any>(endpoint, formData);
    }

    //MODULO DE OBSERVACIONES

    obtenerObservaciones(rutProfesor_str: string): Observable<any> {
      const endpoint = `${this.apiUrl}/obtenerObservaciones`;
      console.log('ProfesoresSerivce.obtenerObservaciones - fetching data for RUT:', rutProfesor_str);
      return this.http.post<any>(endpoint, { rutProfesor_str: rutProfesor_str });
    }

    crearObservacion(formData: FormData): Observable<any> {
      const endpoint = `${this.apiUrl}/crearObservacion`;
      return this.http.post<any>(endpoint, formData);
    }

    enviarAsistencia(asistencia: { rutEstudiante_str: string, idTipoEstado_int: number, fechaRegistro_dat: string, idAsignatura_int: number, idCurso_int: number }[]): Observable<any> {
      return this.http.post(`${this.apiUrl}/enviarAsistencia`, asistencia);
    }

}
