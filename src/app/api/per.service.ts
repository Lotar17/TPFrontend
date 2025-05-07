import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../models/ApiResponse';
import { Persona } from '../models/persona.entity';
import { Direccion } from '../models/direccion.entity';


@Injectable({
  providedIn: 'root'
})
export class PersonaService {
  private apiUrl = ' http://localhost:3000/api/personas'; 

  constructor(private http: HttpClient) {}

 
  getPersonaIdById(id: string): Observable<string> {
    return this.http.get<{ message: string; data: { id: string } }>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data.id) 
    );
  }
  getOne(id: string): Observable<ApiResponse<Persona>> {
    return this.http.get<ApiResponse<Persona>>(`${this.apiUrl}/${id}`);
  }
updatePersona(persona:Persona):Observable<ApiResponse<Persona>>{
  const payload={
    nombre: persona.nombre,
    mail:persona.mail,

    apellido:persona.apellido,
    telefono:persona.telefono,

    apelllido:persona.apellido,
    password: persona.password

  }
  return this.http.patch<ApiResponse<Persona>>(`${this.apiUrl}/${persona.id}`,payload)

  
}
  updatePassword(mail:string,passwordAnterior:string,passwordNueva:string):Observable<any>{

    const payload={
      mail,
      passwordAnterior,
      passwordNueva
    }
    return this.http.patch(`${this.apiUrl}/updatePassword`,payload)
  }

  updateDireccion(direccion:string,id:string):Observable<ApiResponse<Persona>>{
    const payload={
      direccion
    }
    return this.http.patch<ApiResponse<Persona>>(`${this.apiUrl}/${id}`,payload)
}


  resetPassword(token: string, passwordNueva: string): Observable<any> {
    const payload = {
      token,
      passwordNueva,
    };
    return this.http.patch(`${this.apiUrl}/resetPassword`, payload);
    
  }
  
  createDireccion(calle:string,numero:number,localidad:string):Observable<ApiResponse<Direccion>>{
    const payload={
      calle,
      numero,
      localidad

    }
return this.http.post<ApiResponse<Direccion>>('http://localhost:3000/api/direccion',payload)
  }
  
  actualizaDireccion(calle:string,numero:number,localidad:string,usuario:Persona){
this.createDireccion(calle,numero,localidad).subscribe({
  next:(response:any)=>{
console.log('Direccion creada con exito',response.data)
usuario.direccion=response.data
const direccion=response.data.id
console.log('Usuario Id',usuario.id)
if(usuario.id)
  
this.updateDireccion(direccion,usuario.id).subscribe({
  next:(response:any)=>{
console.log('Direccion Actualizada con exito',response.data)
  },
  error:(error:any)=>{


  
    console.error("No se encontro el usuario",error)
  }
})
  },
  error:(error:any)=>{
  
    console.error("No se encontro el usuario",error)
  }
})


  }
  getPersonaByEmail(email: string) {
    const url = `http://localhost:3000/api/personas/email/${email}`;
    return this.http.get<ApiResponse<Persona>>(url);
  }
}
