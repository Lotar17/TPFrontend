import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoginService {
  private apiUrl = 'http://localhost:3000/login';

  constructor(private http: HttpClient) {}

  async login(credentials: {
    mail: string;
    password: string;
  }): Promise<Observable<any>> {
    return await this.http.post(this.apiUrl, credentials, {
      withCredentials: true,
    });
  }
}
