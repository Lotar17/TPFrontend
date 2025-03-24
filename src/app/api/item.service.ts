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



  }