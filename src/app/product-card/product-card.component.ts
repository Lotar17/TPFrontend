import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { Producto } from '../../models/producto.entity';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {


  @Input() producto!: Producto; //


}
