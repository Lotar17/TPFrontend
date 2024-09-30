import { Injectable,inject } from "@angular/core";
import { Product } from "../../interfaces/product.interface";
import { signalSlice } from 'ngxtension/signal-slice';
import { ProductsService } from "./products.service";
import { map } from 'rxjs/operators';



interface state{
products: Product[];

status:'loading'|'success'|'error';
}

@Injectable()
export class ProductStateService{

    private productsService = inject (ProductsService);

private initialState: state = {
products:[],
status:'loading' as const,

};
state = signalSlice({
    initialState: this.initialState,
    sources: [
 this.productsService
 .getProducts()
 .pipe(map((products)=> ({ products, status: 'success' as const }))),
     
    ],
  });




}