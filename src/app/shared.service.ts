import { Injectable } from '@angular/core';
import { ReplaySubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { EstudiantesService } from './estudiantes.service';
import { HttpClient } from '@angular/common/http';
import { ProfesoresService } from './profesores.service';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private static readonly RUT_KEY = 'rut';
  private static readonly ROLE_KEY = 'idtiporol';

  private personaSubject = new ReplaySubject<any>(1); // ReplaySubject para emitir el último valor
  private asignaturasSubject = new ReplaySubject<any[]>(1); // ReplaySubject para emitir el último array de asignaturas

  private datosCargados = false; // Bandera para controlar si los datos del estudiante ya se cargaron

  constructor(private profesoresService: ProfesoresService,private estudiantesService: EstudiantesService, private http:HttpClient) {}

  // Método para establecer los datos de inicio de sesión
  setLoginData(rut: string, idtiporol: number): void {
    this.saveToSessionStorage(SharedService.RUT_KEY, rut);
    this.saveToSessionStorage(SharedService.ROLE_KEY, idtiporol.toString());
    this.loadPersonaData(rut,idtiporol);
  }

  // Método para establecer los datos de las asignaturas
  setAsignaturasData(asignaturas: any[]): void {
    this.asignaturasSubject.next(asignaturas);
  }

  // Método para obtener los datos de inicio de sesión
  getLoginData(): { rut: string | null; idtiporol: number | null } {
    const rut = this.getFromSessionStorage(SharedService.RUT_KEY);
    const idtiporol = this.getFromSessionStorage(SharedService.ROLE_KEY);
    return {
      rut: rut,
      idtiporol: idtiporol ? parseInt(idtiporol) : null
    };
  }

  // Método para borrar los datos de inicio de sesión
  clearLoginData(): void {
    this.removeFromSessionStorage(SharedService.RUT_KEY);
    this.removeFromSessionStorage(SharedService.ROLE_KEY);
    this.personaSubject.next(null);
    this.datosCargados = false;
  }

  // Método privado para cargar los datos del estudiante

  // Método privado para cargar los datos del estudiante o profesor
  private loadPersonaData(rut: string, idtiporol: number): void {
    if (!this.datosCargados) {
      let serviceCall;

      if (idtiporol === 3) { // Suponiendo que 3 es el idtiporol para estudiantes
        serviceCall = this.estudiantesService.getDatosEstudiante(rut);
      } else { // Suponiendo cualquier otro valor para profesores
        serviceCall = this.profesoresService.getDatosProfesor(rut);
      }

      serviceCall.pipe(
        tap(data => {
          if (data && data.length > 0) {
            this.personaSubject.next(data[0]);
            this.datosCargados = true;
          }
        }),
        catchError(error => {
          console.error(`Error al obtener datos de la persona con rol ${idtiporol}:`, error);
          return of(null);
        })
      ).subscribe();
    }
  }

  // Método para obtener los datos del estudiante
  getEstudianteData(): Observable<any> {
    const loginData = this.getLoginData();
    if (loginData.rut && !this.datosCargados) {
      this.loadPersonaData(loginData.rut,3);
    }
    return this.personaSubject.asObservable();
  }

  getProfesorData(): Observable<any> {
    const loginData = this.getLoginData();
    if (loginData.rut && !this.datosCargados) {
      this.loadPersonaData(loginData.rut,2);
    }
    return this.personaSubject.asObservable();
  }

  // Método para obtener los datos de las asignaturas
  getAsignaturasData(): Observable<any[]> {
    return this.asignaturasSubject.asObservable();
  }

  // Método privado para guardar en el sessionStorage
  private saveToSessionStorage(key: string, value: string): void {
    sessionStorage.setItem(key, value);
  }

  // Método privado para obtener del sessionStorage
  private getFromSessionStorage(key: string): string | null {
    return sessionStorage.getItem(key);
  }

  // Método privado para remover del sessionStorage
  private removeFromSessionStorage(key: string): void {
    sessionStorage.removeItem(key);
  }

  obtenerPerfil(rut: string, idtiporol: any): Observable<any[]> {
    const endpoint = 'https://e2ac-172-206-232-198.ngrok-free.app/login/perfil`;
    console.log('sharedService.obtenerPerfil - fetching details for RUT:', rut, 'and Role ID:', idtiporol);
    return this.http.post<any>(endpoint, { rut_str: rut, idTipoRol_int: idtiporol });
  }

  actualizarClave(rut: string, clave: string, rol: number): Observable<any> {
    const endpoint = `https://e2ac-172-206-232-198.ngrok-free.app/login/actualizarClave`;
    console.log('sharedService.actualizarClave - updating password for RUT:', rut, 'and new password:', clave);
    return this.http.put<any>(endpoint, { rut_str: rut, contrasena_str: clave, idTipoRol_int: rol});
  }


  actualizarDatos(rut: string, idtiporol: number, nuevoCorreo: string, nuevoTelefono: string): Observable<any> {
    const endpoint = `https://e2ac-172-206-232-198.ngrok-free.app/login/actualizarDatos`;
    console.log('sharedService.actualizarDatos - updating details for RUT:', rut, 'and Role ID:', idtiporol, 'with new email:', nuevoCorreo, 'and new phone:', nuevoTelefono);
    return this.http.put<any>(endpoint, { rut_str: rut, idTipoRol_int: idtiporol, nuevo_correo: nuevoCorreo, nuevo_telefono: nuevoTelefono });
  }

}
