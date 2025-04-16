// services/productos.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiResponse } from '../../models/ApiResponse.js';
import { Producto } from '../models/producto.entity.js';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  private productosPublicados=new BehaviorSubject <Producto[]>([]);
  productosPublicados$=this.productosPublicados.asObservable();
  private productosSubject = new BehaviorSubject<Producto[]>([]);
  productos$ = this.productosSubject.asObservable();
  private Url='http://localhost:3000/api/productos';
  private Url2='http://localhost:3000/api/productos/persona';
  private producto!:Producto
  private productosVendedorSubject = new BehaviorSubject<Producto[]>([]);
  productosVendedor$ = this.productosVendedorSubject.asObservable(); 
  constructor(private http: HttpClient) {}



  getAll(): void {
    const url = 'http://localhost:3000/api/productos';
    this.http.get<ApiResponse<Producto[]>>(url).subscribe((response) => {
      if (response.data) this.productosSubject.next(response.data);
    });
  }
  getProductosByPersona(idPersona: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.Url2}/${idPersona}`);
  }


  getOne(id: string): Observable<Producto> { 
    const url = `http://localhost:3000/api/productos/${id}`;
    return this.http.get<ApiResponse<Producto>>(url).pipe(
      map((response: ApiResponse<Producto>) => response.data) 
    );
  }
  


actualizarProducto(idProducto: string, productoActualizado: Producto): Observable<any> {
  return this.http.put(`${this.Url}/${idProducto}`, productoActualizado);
}

setProducto(producto:Producto){
  this.producto=producto
}
getProducto(){
  return this.producto
}
deleteProducto(id: string) {
  return this.http.delete(`${this.Url}/${id}`).pipe(
    tap(() => {
      
      const productosActualizados = this.productosSubject.getValue().filter(p => p.id !== id);
      this.productosSubject.next(productosActualizados);
    })
  );
}
}
