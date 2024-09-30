import { Component,inject } from '@angular/core';
import { ProductStateService } from '../data-access/product-state.service';
import { ProductsService } from '../data-access/products.service';


@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
  providers: [ProductStateService,ProductsService]
  
})
export class ProductListComponent {

productsState= inject(ProductStateService)

}
