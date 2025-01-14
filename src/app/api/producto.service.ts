// services/productos.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiResponse } from '../../models/ApiResponse.js';
import { Producto } from '../../models/producto.entity.js';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  private productosSubject = new BehaviorSubject<Producto[]>([]);
  productos$ = this.productosSubject.asObservable();


  constructor(private http: HttpClient) {}



  getAll(): void {
    const url = 'http://localhost:3000/api/productos';
    this.http.get<ApiResponse<Producto[]>>(url).subscribe((response) => {
      if (response.data) this.productosSubject.next(response.data);
    });
  }

getOne(id: string): Observable<Producto> { 
  const url = `http://localhost:3000/api/productos/${id}`;
  return this.http.get<ApiResponse<Producto>>(url).pipe(
    map((response: ApiResponse<Producto>) => response.data) 
  );
}




}