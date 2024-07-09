import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class EventosService {

  private apiUrl = 'http://127.0.0.1:8000/comunes';

  constructor(private http: HttpClient) { }

  getAllEvents(): Observable<any> {
    const endpoint = `${this.apiUrl}/getAllEvents`;
    return this.http.get<any>(endpoint);
  }
}
