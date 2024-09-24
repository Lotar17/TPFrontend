import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiResponse } from '../models/ApiResponse.js';
import { Persona } from '../models/persona.entity.js';

@Injectable({
  providedIn: 'root',
})
export class PersonasService<T> {
  private personasSubject = new BehaviorSubject<Persona[]>([]);
  personas$ = this.personasSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAll(): void {
    const url = 'http://localhost:3000/api/personas';
    this.http.get<ApiResponse<Persona[]>>(url).subscribe((response) => {
      if (response.data) this.personasSubject.next(response.data);
    });
  }

  deleteOne(persona: Persona): Observable<ApiResponse<Persona>> {
    const url = `http://localhost:3000/api/personas/${persona.id}`;
    return this.http.delete<ApiResponse<Persona>>(url).pipe(
      tap(() => {
        const personasActualizadas = this.personasSubject
          .getValue()
          .filter((personaBorrada) => personaBorrada.id !== persona.id);
        this.personasSubject.next(personasActualizadas); // Emitir nuevo estado
      })
    );
  }
}
