import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/ApiResponse';
import { Compra } from '../models/compra.entity';
import { Item } from '../models/item.entity';

@Injectable({
  providedIn: 'root',
})
export class ComprasService {
  private url: string = 'http://localhost:3000/api/compras'; 
  private url2: string= 'http://localhost:3000/api/compras/persona';
  private url3: string= 'http://localhost:3000/api/compras/stock'
  private item_compra: Item[] = [];
  private item_devolucion: Item[] = [];
  private compra!:Compra
  constructor(private http: HttpClient,
    
  ) {}

  
  addCompra(compra: Compra): Observable<any> {
    return this.http.post(`${this.url}`,compra);


    
  }
  // Método para obtener todas las compras
  getAll(): Observable<ApiResponse<Compra[]>> {
    return this.http.get<ApiResponse<Compra[]>>(this.url);
  }

  // Método para obtener una compra por ID
  getOne(id: string): Observable<ApiResponse<Compra>> {
    return this.http.get<ApiResponse<Compra>>(`${this.url}/${id}`);
  }

  // Método para actualizar una compra
  update(compra:Compra): Observable<ApiResponse<Compra>> {
    return this.http.put<ApiResponse<Compra>>(`${this.url}/${compra.id}`, compra);
  }

  // Método para eliminar una compra
  delete(id: string): Observable<ApiResponse<Compra>> {
    return this.http.delete<ApiResponse<Compra>>(`${this.url}/${id}`);
  }
  getcomprasByUser(idUser: string): Observable<ApiResponse<Compra>> {
    return this.http.get<ApiResponse<Compra>>(`${this.url2}/${idUser}`);
  }

  setItem(items:Item[]){
this.item_compra=items

  }
  getItems(): Item[] {
    return this.item_compra;
  }
setDevolucion(itemDevolucion:Item){
  this.item_devolucion
}
getItemsDevolucion(){
  return this.item_devolucion
}

updateStock(id: string): Observable<ApiResponse<Compra>> {
  return this.http.put<ApiResponse<Compra>>(`${this.url3}/${id}`, null, { responseType: 'json' });
}
setCompra(compra:Compra){
  this.compra=compra
}
getCompra(){
  return this.compra
}

}
