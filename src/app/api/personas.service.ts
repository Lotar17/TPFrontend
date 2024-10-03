import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiResponse } from '../models/ApiResponse.js';
import { Persona } from '../models/persona.entity.js';

// SE GENERALIZO ESTE SERVICIO CON CRUD.SERVICE

// LA ELIMINACION DE ESTE SERVICIO ESTA SIENDO EVALUADA

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

  add(
    nombre: string,
    apellido: string,
    email: string,
    telefono: string,
    contrasena: string,
    rol: string
  ) {
    const persona: Persona = {
      nombre: nombre,
      apellido: apellido,
      mail: email,
      telefono: telefono,
      password: contrasena,
      rol: rol,
    };
    const url = 'http://localhost:3000/api/personas/';
    return this.http
      .post<ApiResponse<Persona>>(url, persona)
      .subscribe((response) => {
        persona.id = response.data?.id;
        this.personasSubject.getValue().push(persona);
        const personasActualizadas = this.personasSubject.getValue();
        this.personasSubject.next(personasActualizadas);
      });
  }

  update(
    id: string,
    nombre: string,
    apellido: string,
    email: string,
    telefono: string,
    rol: string,
    contrasena?: string
  ) {
    const persona: Persona = {
      nombre: nombre,
      apellido: apellido,
      mail: email,
      telefono: telefono,
      rol: rol,
    };
    if (contrasena) persona.password = contrasena;
    const url = `http://localhost:3000/api/personas/${id}`;
    console.log(`YA TIENE LA URL:${url}, nombre: ${nombre}`);
    return this.http
      .put<ApiResponse<Persona>>(url, persona)
      .subscribe((response) => {
        const personasActuales = this.personasSubject.getValue();
        const personasActualizadas = personasActuales.map((personaEditada) =>
          personaEditada.id === response.data?.id
            ? response.data!
            : personaEditada
        );
        this.personasSubject.next(personasActualizadas);

        console.log('HIZO EL PUT y actualizó la colección');
      });
  }
}
