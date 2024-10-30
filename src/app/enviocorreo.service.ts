import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EnviocorreoService {

  private apiUrl = 'http://127.0.0.1:8000/comunes'; // Ajusta la URL base según la configuración de tu backend

  constructor(private http: HttpClient) { }

  enviarCorreo(nombre: string, correo: string, mensaje: string ): Observable<any> {
    const endpoint = `${this.apiUrl}/envioCorreo`; // Ajusta la ruta según la configuración de tu backend
    return this.http.post<any>(endpoint, { nombre: nombre, correo: correo, mensaje: mensaje });
  }
}
