import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RegisterService {
    private apiUrl = 'http://localhost:3000/register';

    constructor(private http: HttpClient) {}

    async register(credentials: {
        name :string,
        surname: string,
        mail: string,
        password: string,
        phone: string,
    }): Promise<Observable<any>> {
    return this.http.post(this.apiUrl, credentials);
}
}