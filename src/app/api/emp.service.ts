import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {
  private apiUrl = 'http://localhost:3000/api/empleados/employ'; // URL de la API para empleados

  constructor(private http: HttpClient) {}

  // Método para obtener un ID de empleado por ID
  getEmpleadoIdById(email: string): Observable<string> {
    return this.http.get<{ message: string; data: { id: string } }>(`${this.apiUrl}/${email}`).pipe(
      map(response => response.data.id) // Extrae el ID del empleado de la respuesta
    );
  }
}
