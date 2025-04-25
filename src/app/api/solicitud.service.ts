import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiResponse } from '../models/ApiResponse.js';
import { Producto } from '../models/producto.entity.js';
import { map,concatMap } from 'rxjs/operators';
import { Devolucion } from '../models/solicitudDevolucion.entity.js';
import { Item } from '../models/item.entity.js';
import { ComprasService } from './compra.service.js';
import { Compra } from '../models/compra.entity.js';
import { throwError } from 'rxjs';
import { of } from 'rxjs';
import { CorreoService } from './correo.service.js';

@Injectable({
    providedIn: 'root',
  })
  export class SolicitudService{
    private solicitudesVendedor = new BehaviorSubject<Devolucion[]>([]); 
    solicitudesVendedor$ = this.solicitudesVendedor.asObservable(); 
 private apiUrl='http://localhost:3000/api/devolucion';
 private apiUrl2='http://localhost:3000/api/devolucion/comprador';
    constructor(private http: HttpClient,
       private compraService:ComprasService,
       private correoService:CorreoService
    ) {}

    createDevolutionRequest(itemId: string, motivo: string,cantidad_devuelta:number): Observable<any> {
        
        const payload = { 
        
          itemId,
          motivo,
          cantidad_devuelta
        };
        return this.http.post('http://localhost:3000/api/devolucion', payload);
      }
      updateDevolucion(id:string,estado:string,fechaCierre:string,mensajeCierre:string): Observable<ApiResponse<Devolucion>> {
        
        const payload = { 
        estado,
        fechaCierre,
        mensajeCierre
        };
        return this.http.patch<ApiResponse<Devolucion>>(`${this.apiUrl}/${id}`,payload)
      }
  cierreDevolucionCliente(id:string, fechaEnvioCliente:string):Observable<ApiResponse<Devolucion>> {
const payload={
  fechaEnvioCliente
}
    return this.http.patch<ApiResponse<Devolucion>>(`${this.apiUrl}/${id}`,payload)
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
              updateCompraBydevolution(item: Item, cantidad_devuelta: number): Observable<ApiResponse<Compra>> {
                const totalAnterior = item.compra?.total_compra;
                const precioUnitario = item.precioUnitario;
              
                if (!item.compra || !totalAnterior || !precioUnitario) {
                  return throwError(() => new Error('Faltan datos para actualizar la compra'));
                }
              
                const subTotal = precioUnitario * cantidad_devuelta;
                const valorCompra = totalAnterior - subTotal;
              
                const compraActualizada: Compra = {
                  id: item.compra.id,
                  direccionId: item.compra.direccionId,
                  persona: item.compra.persona,
                  fecha_hora_compra: item.compra.fecha_hora_compra,
                  total_compra: valorCompra
                };
              
                return this.compraService.update(compraActualizada);
              }
              
updateStockByDevolution(){


}
cerrarDevolucion(solicitud: Devolucion, mensajeCierre: string):Observable<Devolucion>{
  const fechaCierre = new Date().toISOString();
  const estado = "Cerrado";
  solicitud.estado = estado;
  solicitud.fechaCierre = fechaCierre;

  const destinatario = solicitud.comprador?.mail;
  const asunto = 'Producto recibido';
  const mensaje = `El producto ${solicitud.item.producto?.descripcion} ha sido devuelto con éxito.`;

  return this.updateDevolucion(solicitud.id!, estado, fechaCierre, mensajeCierre).pipe(
    concatMap(() => {
      if (destinatario) {
        return this.correoService.sendEmail(destinatario, asunto, mensaje);
      } else {
        return of(null); // no hay destinatario, no se envía correo
      }
    })
  );

}

  }

  