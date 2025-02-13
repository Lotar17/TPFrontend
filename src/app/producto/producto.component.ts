import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CRUDService } from '../api/crud.service';
import { Producto } from '../../models/producto.entity';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { ProductCardComponent } from '../product-card/product-card.component';
import { CargoProductosComponent } from '../cargo-productos/cargo-productos.component.js';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../api/Auth.service';
@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, SearchBarComponent, ProductCardComponent,CargoProductosComponent,RouterLink],
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductosComponent {
  productos: Producto[] = [];
  searchTerm: string = '';

  constructor(private crudService: CRUDService<Producto>,
     private router:Router,
     private authService:AuthService
  ) {}

  ngOnInit(): void {
    
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
  verCarrito() {
    const idPersona = this.authService.getUserId();
    if (!idPersona) {
      console.error('Usuario no autenticado');
      return;
    }

    this.router.navigate(['/carrito', idPersona]); 
  }
}


