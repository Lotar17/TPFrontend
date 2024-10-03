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


  // Obtener todos los productos
  getAll(): void {
    const url = 'http://localhost:3000/api/productos';
    this.http.get<ApiResponse<Producto[]>>(url).subscribe((response) => {
      if (response.data) this.productosSubject.next(response.data);
    });
  }
// Obtener producto por id
// En producto.service.ts
getOne(id: string): Observable<Producto> { // Cambia el tipo de id a string
  const url = `http://localhost:3000/api/productos/${id}`;
  return this.http.get<ApiResponse<Producto>>(url).pipe(
    map((response: ApiResponse<Producto>) => response.data) // Asegúrate de que 'data' contenga el producto
  );
}




  // Eliminar un producto
  deleteOne(producto: Producto): Observable<ApiResponse<Producto>> {
    const url = `http://localhost:3000/api/productos/${producto.id}`;
    return this.http.delete<ApiResponse<Producto>>(url).pipe(
      tap(() => {
        const productosActualizados = this.productosSubject
          .getValue()
          .filter((productoBorrado) => productoBorrado.id !== producto.id);
        this.productosSubject.next(productosActualizados);
      })
    );
  }


  // Añadir un nuevo producto
  add(
    nombre: string,
    descripcion: string,
    precio: number,
    stock: number
  ): void {
    const producto: Producto = {
      nombre: nombre,
      descripcion: descripcion,
      precio: precio,
      stock: stock,
    };
    const url = 'http://localhost:3000/api/productos/';
    this.http.post<ApiResponse<Producto>>(url, producto).subscribe((response) => {
      producto.id = response.data?.id;
      this.productosSubject.getValue().push(producto);
      this.productosSubject.next(this.productosSubject.getValue());
    });
  }


  // Actualizar un producto
  update(
    id: string,
    nombre: string,
    descripcion: string,
    precio: number,
    stock: number
  ): void {
    const producto: Producto = {
      nombre: nombre,
      descripcion: descripcion,
      precio: precio,
      stock: stock,
     
    };
    const url = `http://localhost:3000/api/productos/${id}`;
    this.http.put<ApiResponse<Producto>>(url, producto).subscribe((response) => {
      const productosActuales = this.productosSubject.getValue();
      const productosActualizados = productosActuales.map((productoEditado) =>
        productoEditado.id === response.data?.id
          ? response.data!
          : productoEditado
      );
      this.productosSubject.next(productosActualizados);
    });
  }
}
