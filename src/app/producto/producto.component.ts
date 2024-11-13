import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CRUDService } from '../api/crud.service';
import { Producto } from '../../models/producto.entity';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, SearchBarComponent, ProductCardComponent],
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductosComponent implements OnInit {
  productos: Producto[] = [];
  searchTerm: string = '';

  constructor(private crudService: CRUDService<Producto>) {}

  ngOnInit(): void {
    // Cargar todos los productos al principio
    this.loadProductos('');
  }

  loadProductos(searchTerm: string): void {
    this.crudService.getByDescripcion('productos', searchTerm).subscribe((response: any) => {
      if (response && Array.isArray(response.data)) {
        this.productos = response.data;
      } else {
        this.productos = [];
      }
    });
  }

  updateSearchTerm(searchTerm: string) {
    this.searchTerm = searchTerm;
    this.loadProductos(searchTerm);
  }
}


