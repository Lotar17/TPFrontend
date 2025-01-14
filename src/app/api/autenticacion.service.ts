import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '../models/ApiResponse.js';
import { firstValueFrom } from 'rxjs';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { SesionPersona } from '../models/sesionPersona.entity.js';

@Injectable({
  providedIn: 'root',
})
export class AutenticacionService {
  private subject = new BehaviorSubject<SesionPersona | null>(null);
  $ = this.subject.asObservable();
  url = 'http://localhost:3000/login/checkPermissions';

  constructor(private http: HttpClient) {}

  getUserInformation() {
    let datosUsuario: SesionPersona | undefined = undefined;
    this.http
      .get<ApiResponse<SesionPersona>>(
        'http://localhost:3000/login/getUserInformation',
        { withCredentials: true }
      )
      .subscribe((response) => {
        if (response.data !== undefined) this.subject.next(response.data);
      });
  }

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
}
