import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiResponse } from '../../models/ApiResponse.js';
import { Producto } from '../models/producto.entity.js';
import { map } from 'rxjs/operators';
import { Devolucion } from '../models/solicitudDevolucion.entity.js';
import { Item } from '../models/item.entity.js';

@Injectable({
    providedIn: 'root',
  })
  export class SolicitudService{
    private solicitudesVendedor = new BehaviorSubject<Devolucion[]>([]); 
    solicitudesVendedor$ = this.solicitudesVendedor.asObservable(); 
 private apiUrl='http://localhost:3000/api/devolucion';
 private apiUrl2='http://localhost:3000/api/devolucion/comprador';
    constructor(private http: HttpClient,
       
    ) {}

    createDevolutionRequest(itemId: string, motivo: string,cantidad_devuelta:number): Observable<any> {
        
        const payload = { 
        
          itemId,
          motivo,
          cantidad_devuelta
        };
        return this.http.post('http://localhost:3000/api/devolucion', payload);
      }
      updateDevolucion(id:string,estado:string,fechaCierre:string,mensajeCierre:string): Observable<any> {
        
        const payload = { 
        estado,
        fechaCierre,
        mensajeCierre
        };
        return this.http.patch(`${this.apiUrl}/${id}`,payload)
      }
      


      getVendedorRequest(idVendedor:string): Observable<ApiResponse<Devolucion>>{
return this.http.get<ApiResponse<Devolucion>>(`${this.apiUrl}/${idVendedor}`)
      }
      makeDecission(idSolicitud: string, estado: string): Observable<ApiResponse<Devolucion>> {
        const payload = { estado }; // Enviar el estado en un objeto
        return this.http.put<ApiResponse<Devolucion>>(`${this.apiUrl}/${idSolicitud}`, payload);
      }
      
      getCompradorRequest(idComprador:string): Observable<ApiResponse<Devolucion>>{
        return this.http.get<ApiResponse<Devolucion>>(`${this.apiUrl2}/${idComprador}`)
              }



              getSolicitudesVendedor(idVendedor: string): void {
                this.http.get<{ data: Devolucion[] }>(`${this.apiUrl}/${idVendedor}`).subscribe({
                  next: (response) => {
                    this.solicitudesVendedor.next(response.data); // Emitimos los datos actualizados
                  },
                  error: (error) => console.error('Error al obtener solicitudes:', error)
                });
              }
            
              Decission(idSolicitud: string, estado: string): Observable<any> {
                const payload = { estado };
                return this.http.put(`${this.apiUrl}/${idSolicitud}`, payload).pipe(
                  tap(() => {
                    // Lógica de actualización local (sin subscribe)
                    const solicitudesActuales = this.solicitudesVendedor.getValue();
                    const solicitudExistente = solicitudesActuales.find(s => s.id === idSolicitud);
              
                    if (solicitudExistente) {
                      solicitudExistente.estado = estado;
                      solicitudExistente.fechaConfirmacion = new Date().toISOString();
                    }
              
                    this.solicitudesVendedor.next([...solicitudesActuales]);
                  })
                );
              }
              
            


  }

  