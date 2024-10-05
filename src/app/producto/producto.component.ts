import { Component } from '@angular/core';
import { ProductosService } from '../api/producto.service';
import { Producto } from '../../models/producto.entity';
import { RouterLink } from '@angular/router';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../product-card/product-card.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';


@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [RouterLink, CommonModule, ProductCardComponent, SearchBarComponent],
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css'] // Corrección aquí
})

export class ProductosComponent implements OnInit {
  productos: Producto[] = []; // Lista de productos


  constructor(private productosService: ProductosService) {}


  ngOnInit(): void {
    this.productosService.getAll(); // Llama al servicio para obtener todos los productos
    this.productosService.productos$.subscribe((data) => {
      this.productos = data; // Actualiza la lista de productos
    });
  }
}
