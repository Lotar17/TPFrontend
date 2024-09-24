import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component.js';
import { FooterComponent } from '../footer/footer.component.js';
import { CommonModule } from '@angular/common';
import { SearchBarComponent } from '../search-bar/search-bar.component.js';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HeaderComponent,FooterComponent,CommonModule,SearchBarComponent,RouterLink,RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})

  export class DashboardComponent {
   
    searchTerm: string = '';
   
    products = [
      {
        id: 1,
        nombre: 'Producto 1',
        descripcion: 'desc 1.',
        precio: 29.99,
        imageUrl: 'https://via.placeholder.com/150',
      },
      {
        id: 2,
        nombre: 'Producto 2',
        descripcion: 'This is a description of Product 2.',
        precio: 49.99,
        imageUrl: 'https://via.placeholder.com/150',
      },
      {
        id: 3,
        nombre: 'Producto 3',
        descripcion: 'This is a description of Product 3.',
        precio: 19.99,
        imageUrl: 'https://via.placeholder.com/150',
      },
      {
        id: 4,
        nombre: 'Producto 4',
        descripcion: 'This is a description of Product 4.',
        precio: 69.99,
        imageUrl: 'https://via.placeholder.com/150',
      },
      {
        id: 5,
        nombre: 'Producto 5',
        descripcion: 'This is a description of Product 5.',
        precio: 79.99,
        imageUrl: 'https://via.placeholder.com/150',
      },
    ];

    updateSearchTerm(term: string) {
      this.searchTerm = term;
    }

    filteredProducts() {
      return this.products.filter(product => 
        product.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
        product.descripcion.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
  }
  


  }
