import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { item } from '../models/item.entity';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private carritoItems = new BehaviorSubject<any[]>([]); 
  carritoItems$ = this.carritoItems.asObservable(); //
  private Url = 'http://localhost:3000/api/item'; 
  private Url2 = 'http://localhost:3000/api/item/persona';
  constructor(private http: HttpClient) {}

  addItemToCarrito(idProducto: string, idPersona: string) {
    const item= { producto: idProducto, persona: idPersona };

    return this.http.post(`${this.Url}/`, item);
  }

  getCarrito(idPersona: string): Observable<any> {
    return this.http.get(`${this.Url2}/${idPersona}`);


    
  }
  getItemById(id: string): Observable<item> {
    return this.http.get<item>(`${this.Url}/${id}`);
  }

  obtenerCarrito(): any[] {
    return this.carritoItems.getValue();
  }

  // 🔹 Actualizar el carrito en memoria y la 
  actualizarCarrito(nuevoCarrito: any[]) {
    this.carritoItems.next(nuevoCarrito);
  }

decrementQuantityofItem(idProducto: string, idPersona: string){


  const item= { producto: idProducto, persona: idPersona };

  return this.http.post(`${this.Url}/decrementa`, item);
}

removeItem(idItem:string){

  
  return this.http.delete(`${this.Url}/${idItem}`)


}

}

