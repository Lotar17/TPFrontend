import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/ApiResponse';
import { HistoricoPrecio } from '../models/historicoprecio.entity';
import { map } from 'rxjs';


@Injectable({
    providedIn: 'root',
  })
  export class HistoricoPrecioService {
 
  
    url = 'http://localhost:3000/api/historico-precios/producto';


    constructor(private http: HttpClient) {}
  
    getOne(productoId: string): Observable<number | undefined> {
        return this.http
          .get<ApiResponse<HistoricoPrecio>>(`${this.url}/${productoId}`)
          .pipe(
            map((response) => response.data?.valor) // Solo extraemos el valor
          );
      }
      



}