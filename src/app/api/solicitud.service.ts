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

  }

  