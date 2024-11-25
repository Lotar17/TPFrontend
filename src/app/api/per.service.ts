import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {
  private apiUrl = ' http://localhost:3000/api/personas'; // URL de la API para personas

  constructor(private http: HttpClient) {}

  // Método para obtener un ID de persona por ID
  getPersonaIdById(id: string): Observable<string> {
    return this.http.get<{ message: string; data: { id: string } }>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data.id) // Extrae el ID de la persona de la respuesta
    );
  }
}
