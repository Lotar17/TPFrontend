import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Seguimiento } from "../models/seguimiento.entity";
import { Persona } from "../models/persona.entity";
import { EstadoSeguimiento } from "../models/estado_seguimiento.entity";
import { BehaviorSubject } from "rxjs";
@Injectable({
    providedIn: 'root',
  })
  export class SeguimientoService{
     private seguimientosCLiente = new BehaviorSubject<Seguimiento[]>([]); // Almacena el estado del carrito
      seguimientosCLiente$ = this.seguimientosCLiente.asObservable(); 
    private apiUrl: string ='http://localhost:3000/api/seguimiento/';
    private apiUrl1: string = 'http://localhost:3000/api/seguimiento/cliente';

   private apiUrl2:string= 'http://localhost:3000/api/estado-seguimiento/'
   private apiUrl3:string= 'http://localhost:3000/api/estado-seguimiento/67f0395b6779d65a745c26f0'
   private apiUrl3_1:string= 'http://localhost:3000/api/estado-seguimiento'
   private apiUrl4:string='http://localhost:3000/api/personas/'
    private apiUrl5:string='http://localhost:3000/api/localidad/'
constructor(private http: HttpClient  ) {}
  
 createSeguimiento(itemId:string,idPersona:string): Observable<any> {

  const payload={
    cliente:idPersona,
    item:itemId
  }
    return this.http.post(`${this.apiUrl}`,payload);
 }// implementado

 searchEmployee():Observable<any>{

  return this.http.get(`${this.apiUrl3}`)
 }
 searchEmployeeLocalidad(idLocalidad:string):Observable<{data:Persona}>{

  return this.http.get<{data:Persona}>(`${this.apiUrl3_1}/${idLocalidad}`)
 }
getEmployeEstado(id:string):Observable<any>{
  return this.http.get(`${this.apiUrl4}/${id}`)
}




 createEstado1(idSeguimiento:string,idEmpleado:string,localidad:string):Observable<{data:EstadoSeguimiento}>{

  const payload={
  
    
    localidad:localidad,
    empleado:idEmpleado,
    seguimiento:idSeguimiento
  
  
  }
  
  return this.http.post<{data:EstadoSeguimiento}>(`${this.apiUrl2}`,payload)
   }
  
 getseguimientosCliente(idCliente: string): void {
    this.http.get<{ data: Seguimiento[] }>(`${this.apiUrl1}/${idCliente}`).subscribe({
      next: (response) => {
        console.log('Respuesta desde el servicio:', response.data); 
        this.seguimientosCLiente.next(response.data); // Emitimos los datos actualizados
      },
      error: (error) => console.error('Error al obtener carrito:', error)
    });
  }
  getLocalidades():Observable<any>{
    return this.http.get(`${this.apiUrl5}`)
  }
updateEstadoSeguimiento(id:string,condicion:string):Observable<any>{
  
  const payload={
    condicion
  }
  console.log(`${this.apiUrl2}${id}`, payload);

  return this.http.patch(`${this.apiUrl2}${id}`,payload)
}


  }