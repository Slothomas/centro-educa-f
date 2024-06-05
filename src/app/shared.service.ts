import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { EstudiantesService } from './estudiantes.service';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private static readonly RUT_KEY = 'rutEstudiante';
  private static readonly ROLE_KEY = 'idtiporol';
  private estudianteSubject = new BehaviorSubject<any>(null);
  private datosCargados = false;

  constructor(private estudiantesService: EstudiantesService) {}

  setLoginData(rut: string, idtiporol: number): void {
    console.log('SharedService.setLoginData - rut:', rut, 'idtiporol:', idtiporol);
    sessionStorage.setItem(SharedService.RUT_KEY, rut);
    sessionStorage.setItem(SharedService.ROLE_KEY, idtiporol.toString());
    this.loadEstudianteData(rut);
  }

  getLoginData(): { rut: string | null; idtiporol: number | null } {
    const rut = sessionStorage.getItem(SharedService.RUT_KEY);
    const idtiporol = sessionStorage.getItem(SharedService.ROLE_KEY);
    const loginData = {
      rut: rut,
      idtiporol: idtiporol ? parseInt(idtiporol) : null
    };
    console.log('SharedService.getLoginData - loginData:', loginData);
    return loginData;
  }

  clearLoginData(): void {
    console.log('SharedService.clearLoginData');
    sessionStorage.removeItem(SharedService.RUT_KEY);
    sessionStorage.removeItem(SharedService.ROLE_KEY);
    this.estudianteSubject.next(null);
    this.datosCargados = false;
  }

  private loadEstudianteData(rut: string): void {
    console.log('SharedService.loadEstudianteData - fetching data for RUT:', rut);
    if (!this.datosCargados) {
      this.estudiantesService.getDatosEstudiante(rut).pipe(
        tap(data => {
          console.log('SharedService.loadEstudianteData - datos del estudiante:', data);
          if (data && data.length > 0) {
            this.estudianteSubject.next(data[0]);
            this.datosCargados = true;
          }
        }),
        catchError(error => {
          console.error('SharedService.loadEstudianteData - error al obtener datos del estudiante:', error);
          return of(null);
        })
      ).subscribe();
    }
  }

  getEstudianteData(): Observable<any> {
    const loginData = this.getLoginData();
    if (loginData.rut && !this.datosCargados) {
      this.loadEstudianteData(loginData.rut);
    }
    return this.estudianteSubject.asObservable();
  }
}
