import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../models/ApiResponse';
import { Item } from '../models/item.entity';

@Injectable({
    providedIn: 'root',
  })
  export class ItemService{
item!: Item
private apiUrl = ' http://localhost:3000/api/item'; 
private apiUrl2 = ' http://localhost:3000/api/item/update';

constructor(private http: HttpClient) {}
setItem(it: Item) {
  this.item = JSON.parse(JSON.stringify(it)); // Clona el objeto para forzar actualización
}


getItem(){
    return this.item
}

getOne(id: string): Observable<ApiResponse<Item>> {
    return this.http.get<ApiResponse<Item>>(`${this.apiUrl}/${id}`);
  }

update(item:Item,cantidad_devuelta:number): Observable<ApiResponse<Item>> {

  const payload=
  {
    cantidad_devuelta

  }
    return this.http.patch<ApiResponse<Item>>(`${this.apiUrl2}/${item.id}`, payload);
  }

removeItem(idItem:string): Observable<ApiResponse<Item>>{
  return this.http.delete<ApiResponse<Item>>(`${this.apiUrl}/${idItem}`);
}
validoExistenciaItem(idProducto:string,idPersona:string):Observable<ApiResponse<Item>>{

  return this.http.get<ApiResponse<Item>>(`${this.apiUrl}/valido/${idProducto}/${idPersona}`)
}
getVentasByUser(id:string): Observable<ApiResponse<Item>>{
  return this.http.get<ApiResponse<Item>>(`http://localhost:3000/api/compras/ventas/${id}`)
}
}