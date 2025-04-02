import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Item } from '../models/item.entity';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private carritoItems = new BehaviorSubject<Item[]>([]); // Almacena el estado del carrito
  carritoItems$ = this.carritoItems.asObservable(); // Observable para que el componente se suscriba
  private Url = 'http://localhost:3000/api/item'; 
  private Url1 = 'http://localhost:3000/api/item/decrementa';
  private Url2 = 'http://localhost:3000/api/item/persona';
  private Url3 = 'http://localhost:3000/api/item/create'
  constructor(private http: HttpClient) {}


  getCarrito(idPersona: string): void {
    this.http.get<{ data: Item[] }>(`${this.Url2}/${idPersona}`).subscribe({
      next: (response) => {
        this.carritoItems.next(response.data); // Emitimos los datos actualizados
      },
      error: (error) => console.error('Error al obtener carrito:', error)
    });
  }

  addItemToCarrito(idProducto: string, idPersona: string): void {
    this.http.post<{ message: string }>(`${this.Url}/`, { producto: idProducto, persona: idPersona })
      .subscribe({
        next: () => {
          let carritoActual = this.carritoItems.getValue();
          let itemExistente = carritoActual.find(i => i.producto?.id === idProducto);

          if (itemExistente) {
            itemExistente.cantidad_producto++; // Incrementamos en la interfaz
          } else {
            this.getCarrito(idPersona); // Si es un nuevo ítem, recargamos desde el backend
            return;
          }

          this.carritoItems.next([...carritoActual]); // Emitimos el nuevo estado del carrito
        },
        error: (error) => console.error('Error al agregar item:', error)
      });
  }


 
  getItemById(id: string): Observable<Item> {
    return this.http.get<Item>(`${this.Url}/${id}`);
  }

  obtenerCarrito(): any[] {
    return this.carritoItems.getValue();
  }

  // 🔹 Actualizar el carrito en memoria y la 
  actualizarCarrito(nuevoCarrito: any[]) {
    this.carritoItems.next(nuevoCarrito);
  }

  DecrementQuantity(idProducto: string, idPersona: string): void {
    this.http.post<{ message: string }>(`${this.Url1}/`, { producto: idProducto, persona: idPersona })
      .subscribe({
        next: () => {
          let carritoActual = this.carritoItems.getValue();
          let itemExistente = carritoActual.find(i => i.producto?.id === idProducto);

          if (itemExistente) {
            itemExistente.cantidad_producto--; // Decrementamos en la interfaz
          } 

          this.carritoItems.next([...carritoActual]); // Emitimos el nuevo estado del carrito
        },
        error: (error) => console.error('Error al agregar item:', error)
      });
  }



  removeItem(itemId: string): void {
    this.http.delete<{ message: string }>(`${this.Url}/${itemId}`).subscribe({
      next:()=>{
    let carritoActual = this.carritoItems.getValue();
    carritoActual = carritoActual.filter(i => i.id !== itemId);
    this.carritoItems.next([...carritoActual]); // Emitimos el nuevo carrito
  
  },error: (error) => console.error('Error al eliminar el item:', error)
});
}
createItem(idProducto:string,idPersona:string,cantidad_producto:number):Observable<Item>{
  const item={producto:idProducto,persona:idPersona,cantidad_producto:cantidad_producto}
  return this.http.post<Item>(`${this.Url3}`,item);

}
  

}
