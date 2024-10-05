import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private token: string | null = null;
    private usuarioId: string | null = null;

setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token); // Guardar en localStorage para mantener la sesión
}

getToken(): string | null {
    return this.token ?? localStorage.getItem('auth_token');
}

setUserId(id: string) {
    this.usuarioId = id;
    localStorage.setItem('user_id', id); // Guardar el usuarioId también
}

// AuthService
getUserId(): string {
    return this.usuarioId?? ''; // Retorna una cadena vacía si currentUser o su id son nulos
}


clearSession() {
    this.token = null;
    this.usuarioId = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_id');
}
}
