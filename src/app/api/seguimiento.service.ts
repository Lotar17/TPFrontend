import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Seguimiento } from "../models/seguimiento.entity";
import { Persona } from "../models/persona.entity";
import { EstadoSeguimiento } from "../models/estado_seguimiento.entity";
import { BehaviorSubject } from "rxjs";
import { concatMap,tap,map,throwError,Observable } from "rxjs";
import { CorreoService } from "./correo.service";


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
constructor(private http: HttpClient,
  private correoService:CorreoService
  ) {}
  
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

procesarCierreEstado(estado: EstadoSeguimiento, localidad: string): Observable<any> {
  const idEstado = estado.id;
  if (!idEstado) return throwError(() => new Error('ID de estado no válido'));

  return this.updateEstadoSeguimiento(idEstado, "Cerrado").pipe(
    tap((response: any) => {
      console.log('Estado cerrado con éxito:', response.data);
    }),
    concatMap((response: any) => {
      const estadoCerrado = response.data;
      return this.searchEmployeeLocalidad(localidad).pipe( 
        map((empleadoResponse) => ({ estadoCerrado, empleado: empleadoResponse.data }))
      );
    }),
    concatMap(({ estadoCerrado, empleado }) => {
      if (!empleado?.id) return throwError(() => new Error('Empleado no encontrado'));

 
if(estado.seguimiento?.id)
      return this.createEstado1(estado.seguimiento.id, empleado.id, localidad).pipe(
        tap((nuevoEstadoResponse) => {
          const estadoNuevo = nuevoEstadoResponse.data;
          const destinatario = empleado.mail;
          const asunto = `Asignación proceso ${estadoNuevo.estado}`;
          const mensaje = `Hola ${empleado.nombre}, se te asignó el proceso correspondiente.`;

          this.correoService.sendEmail(destinatario, asunto, mensaje).subscribe({
            next: () => console.log('📤 Correo enviado a empleado:', destinatario),
            error: (error) => console.error('❌ Error al enviar correo a empleado:', error),
          });

          if (estadoNuevo.estado === 'Cerrado') {
            const seguimiento = estadoNuevo.seguimiento;
            const producto = seguimiento?.item?.producto;
            const vendedorEmail = producto?.persona?.mail;
            const compradorEmail = seguimiento?.cliente?.mail;
            const nombreProducto = producto?.descripcion ?? '';

            if (vendedorEmail) {
              this.correoService.sendEmail(
                vendedorEmail,
                'Producto entregado',
                `Hola, te informamos que ${nombreProducto} ha sido entregado correctamente al cliente.`
              ).subscribe({
                next: () => console.log('📤 Correo enviado al vendedor:', vendedorEmail),
                error: (err) => console.error('❌ Error al enviar correo al vendedor:', err)
              });
            }

            if (compradorEmail) {
              this.correoService.sendEmail(
                compradorEmail,
                'Tu pedido ha llegado',
                `Hola, te informamos que ${nombreProducto} llegó correctamente a destino. ¡Gracias por tu compra!`
              ).subscribe({
                next: () => console.log('📤 Correo enviado al cliente:', compradorEmail),
                error: (err) => console.error('❌ Error al enviar correo al cliente:', err)
              });
            }
          }
        })
      );
      return throwError(() => new Error('ID de seguimiento no disponible'));
    })
  );
}

  }