import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../models/ApiResponse';
import { Persona } from '../models/persona.entity';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {
  private apiUrl = ' http://localhost:3000/api/personas'; 

  constructor(private http: HttpClient) {}

 
  getPersonaIdById(id: string): Observable<string> {
    return this.http.get<{ message: string; data: { id: string } }>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data.id) 
    );
  }
  getOne(id: string): Observable<ApiResponse<Persona>> {
    return this.http.get<ApiResponse<Persona>>(`${this.apiUrl}/${id}`);
  }

  
  
}
