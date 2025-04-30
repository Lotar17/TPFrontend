import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Item } from '../models/item.entity';
import { ApiResponse } from '../models/ApiResponse';
import { ItemService } from './item.service';
import { AutenticacionService } from './autenticacion.service';
import { Producto } from '../models/producto.entity';

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
  constructor(private http: HttpClient,
    private itemService:ItemService,
    private autenticacionService:AutenticacionService
  ) {}


  getCarrito(idPersona: string): void {
    console.log('id',idPersona)
    this.http.get<{ data: Item[] }>(`${this.Url2}/${idPersona}`).subscribe({
      next: (response) => {
        console.log('')
        this.carritoItems.next(response.data); // Emitimos los datos actualizados
      },
      error: (error) => console.error('Error al obtener carrito:', error)
    });
  }

  addItemToCarrito(idProducto: string, idPersona: string): void { // No se usa mas
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
addToCart1(persona:string,producto:string):Observable<ApiResponse<Item>>{

const payload={
persona,
producto
}
return this.http.post<ApiResponse<Item>>(`${this.Url}/add`,payload)
}
IncrementQuantity(itemId:string,idProducto:string): void {
  this.http.patch<{ message: string }>(`${this.Url}/incrementaItem`, { itemId })
    .subscribe({
      next: () => {
        let carritoActual = this.carritoItems.getValue();
        let itemExistente = carritoActual.find(i => i.producto?.id === idProducto);

        if (itemExistente) {
          itemExistente.cantidad_producto++; 
        } 

        this.carritoItems.next([...carritoActual]); 
      },
      error: (error) => console.error('Error al incrementar item:', error)
    });
}
manejarItemCarrito(
  producto: Producto,
  mostrarMensajeStock: (msg: string) => void,
  mostrarNotificacion?: () => void
): void {
  const idProducto = producto.id;
  if (!idProducto) return;

  this.autenticacionService.getUserInformation().subscribe({
    next: (response: any) => {
      const userId = response.data?.id;
      if (!userId) return;

      this.itemService.validoExistenciaItem(idProducto, userId).subscribe({
        next: (response) => {
          const item = response.data;

          if (item && item.id) {
            if ((producto.stock !== undefined && item.cantidad_producto >= producto.stock) || (producto.stock !== undefined && producto.stock===0) ) {
              mostrarMensajeStock('No puedes agregar más, alcanzaste el stock disponible.');
              return;
            }

            this.IncrementQuantity(item.id, idProducto);
            if (mostrarNotificacion) mostrarNotificacion(); 
          } else {
            this.addToCart1(userId, idProducto).subscribe({
              next: (resp) => {
                console.log('Item creado con éxito', resp.data);
                if (mostrarNotificacion) mostrarNotificacion(); 
              },
              error: (error: any) => {
                console.error("No se creó el item", error);
              }
            });
          }
        },
        error: (error: any) => {
          console.error("No se pudo validar existencia del item", error);
        }
      });
    },
    error: (error: any) => {
      console.error("No se encontró el usuario", error);
    }
  });
}
calcularSubtotal(items: Item[]): number {
  return items.reduce((total, item) => {
    if (!item.producto || !item.producto.hist_precios) return total;

    // Filtrar precios con fecha definida
    const preciosConFecha = item.producto.hist_precios.filter((p: any) => p.fechaDesde);

    // Ordenar los precios por fecha
    const preciosOrdenados = [...preciosConFecha].sort((a: any, b: any) =>
      new Date(b.fechaDesde ?? 0).getTime() - new Date(a.fechaDesde ?? 0).getTime()
    );

    // Obtener el precio más reciente
    const precioActual = preciosOrdenados.length > 0 ? preciosOrdenados[0].valor : 0;

    // Acumulación del subtotal
    return total + precioActual * item.cantidad_producto;
  }, 0);
}



}
