import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfesoresService {
  private apiUrl = 'http://127.0.0.1:8000/profesor/getAllTeachers'
  //'http://127.0.0.1:8000/profesor/getAllTeachers'; // Cambia esta URL si es necesario
    //https://centro-educa-b.azurewebsites.net/profesor/getAllTeachers
  constructor(private http: HttpClient) {}

  getAllTeachers(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
