import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '../models/ApiResponse.js';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AutenticacionService {
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
}
