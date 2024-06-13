import { Injectable } from '@angular/core';
import { ReplaySubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { EstudiantesService } from './estudiantes.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private static readonly RUT_KEY = 'rutEstudiante';
  private static readonly ROLE_KEY = 'idtiporol';

  private estudianteSubject = new ReplaySubject<any>(1); // ReplaySubject para emitir el último valor
  private asignaturasSubject = new ReplaySubject<any[]>(1); // ReplaySubject para emitir el último array de asignaturas

  private datosCargados = false; // Bandera para controlar si los datos del estudiante ya se cargaron

  constructor(private estudiantesService: EstudiantesService, private http:HttpClient) {}

  // Método para establecer los datos de inicio de sesión
  setLoginData(rut: string, idtiporol: number): void {
    this.saveToSessionStorage(SharedService.RUT_KEY, rut);
    this.saveToSessionStorage(SharedService.ROLE_KEY, idtiporol.toString());
    this.loadEstudianteData(rut);
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
    this.estudianteSubject.next(null);
    this.datosCargados = false;
  }

  // Método privado para cargar los datos del estudiante
  private loadEstudianteData(rut: string): void {
    if (!this.datosCargados) {
      this.estudiantesService.getDatosEstudiante(rut).pipe(
        tap(data => {
          if (data && data.length > 0) {
            this.estudianteSubject.next(data[0]);
            this.datosCargados = true;
          }
        }),
        catchError(error => {
          console.error('Error al obtener datos del estudiante:', error);
          return of(null);
        })
      ).subscribe();
    }
  }

  // Método para obtener los datos del estudiante
  getEstudianteData(): Observable<any> {
    const loginData = this.getLoginData();
    if (loginData.rut && !this.datosCargados) {
      this.loadEstudianteData(loginData.rut);
    }
    return this.estudianteSubject.asObservable();
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
    const endpoint = `https://centro-educa-back.azurewebsites.net/login/perfil`;
    console.log('sharedService.obtenerPerfil - fetching details for RUT:', rut, 'and Role ID:', idtiporol);
    return this.http.post<any>(endpoint, { rut_str: rut, idTipoRol_int: idtiporol });
  }

  actualizarClave(rut: string, clave: string): Observable<any> {
    const endpoint = `https://centro-educa-back.azurewebsites.net/login/actualizarClave`;
    console.log('sharedService.actualizarClave - updating password for RUT:', rut, 'and new password:', clave);
    return this.http.put<any>(endpoint, { rut_str: rut, contrasena_str: clave });
  }


  actualizarDatos(rut: string, idtiporol: number, nuevoCorreo: string, nuevoTelefono: string): Observable<any> {
    const endpoint = `https://centro-educa-back.azurewebsites.net/login/actualizarDatos`;
    console.log('sharedService.actualizarDatos - updating details for RUT:', rut, 'and Role ID:', idtiporol, 'with new email:', nuevoCorreo, 'and new phone:', nuevoTelefono);
    return this.http.put<any>(endpoint, { rut_str: rut, idTipoRol_int: idtiporol, nuevo_correo: nuevoCorreo, nuevo_telefono: nuevoTelefono });
  }

}
