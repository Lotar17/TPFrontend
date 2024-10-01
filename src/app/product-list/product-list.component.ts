import { Component,inject } from '@angular/core';
import { ProductStateService } from '../data-access/product-state.service';
import { ProductCardComponent } from '../product-card/product-card.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ProductCardComponent, SearchBarComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
  providers: [ProductStateService]
  
})
export class ProductListComponent {

productsState= inject(ProductStateService)

}
