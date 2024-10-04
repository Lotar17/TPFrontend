import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { CargoProductosComponent } from '../cargo-productos/cargo-productos.component.js';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, CommonModule, SearchBarComponent,CargoProductosComponent,RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  searchTerm: string = '';
  
  // Lista de productos
  products = [
    {
      id: 1,
      nombre: 'Producto 1',
      descripcion: 'Descripción del Producto 1.',
      precio: 29.99,
      imageUrl: 'https://via.placeholder.com/150',
    },
    {
      id: 2,
      nombre: 'Producto 2',
      descripcion: 'Descripción del Producto 2.',
      precio: 49.99,
      imageUrl: 'https://via.placeholder.com/150',
    },
    {
      id: 3,
      nombre: 'Producto 3',
      descripcion: 'Descripción del Producto 3.',
      precio: 19.99,
      imageUrl: 'https://via.placeholder.com/150',
    },
    {
      id: 4,
      nombre: 'Producto 4',
      descripcion: 'Descripción del Producto 4.',
      precio: 69.99,
      imageUrl: 'https://via.placeholder.com/150',
    },
    {
      id: 5,
      nombre: 'Producto 5',
      descripcion: 'Descripción del Producto 5.',
      precio: 79.99,
      imageUrl: 'https://via.placeholder.com/150',
    },
  ];

  // Actualizar el término de búsqueda
  updateSearchTerm(term: string) {
    this.searchTerm = term;
  }

  // Función para filtrar productos según el término de búsqueda
  filteredProducts() {
    if (!this.searchTerm) {
      return this.products;
    }
    
    return this.products.filter(product => 
      product.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
      product.descripcion.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
