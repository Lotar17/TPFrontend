import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '../models/ApiResponse.js';
import { firstValueFrom } from 'rxjs';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { SesionPersona } from '../models/sesionPersona.entity.js';
import { Persona } from '../models/persona.entity.js';

@Injectable({
  providedIn: 'root',
})
export class AutenticacionService {
  private subject = new BehaviorSubject<SesionPersona | null>(null);
  usuarioId!:string
  $ = this.subject.asObservable();
  url = 'http://localhost:3000/login/checkPermissions';

  constructor(private http: HttpClient) {}

  async getRolByCookie(): Promise<string | undefined> {
    try {
      const response = await firstValueFrom(
        this.http.get<ApiResponse<string | undefined>>(this.url, {
          withCredentials: true,
        })
      );
      console.log(`El rol del usuario es ${response.data}`);
      return response.data;
    } catch {
      return undefined;
    }
  }

  getUserInformation(): Observable<ApiResponse<SesionPersona | undefined>> {
    return this.http.get<ApiResponse<SesionPersona | undefined>>(
      'http://localhost:3000/login/getUserInformation',
      {
        withCredentials: true,
      }
    );
  }

  setUser(user:string){
    this.usuarioId=user
  }
  getUser(){
    return this.usuarioId
  }
}
