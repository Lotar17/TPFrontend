
import { Injectable } from "@angular/core";
import { BaseHttpService } from "../../base-data-access/base-http.service";
import { Observable } from "rxjs";
import { Product } from "../../interfaces/product.interface";

@Injectable({providedIn:'root'})

export class ProductsService extends BaseHttpService{

    

    getProducts(): Observable<Product[]>{

        return this.http.get<any[]>('https://fakestoreapi.com/products')
    }


}