import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/ApiResponse.js';
import { Persona } from '../models/persona.entity.js';

@Injectable({
  providedIn: 'root',
})
export class PersonasService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<ApiResponse<Persona[]>> {
    const url = 'http://localhost:3000/api/personas';
    return this.http.get<ApiResponse<Persona[]>>(url);
  }
}
