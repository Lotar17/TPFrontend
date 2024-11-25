import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CRUDService } from '../api/crud.service.js';
import { Producto } from '../models/producto.entity.js';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {
  searchTerm: string = '';
  productos: Producto[] = [];

  constructor(private http: HttpClient, private crudService: CRUDService<Producto>) {}

  // Emite un evento con el término de búsqueda
  @Output() searchEvent = new EventEmitter<string>();

  onSearch() {
    if (this.searchTerm.trim()) {
      this.crudService.getByDescripcion('productos', this.searchTerm)
        .subscribe((response: Producto[]) => { 
          this.productos = response || []; // Asignar directamente el arreglo de productos
          console.log('Productos filtrados:', this.productos);
        });
      // Emitimos el término de búsqueda para que el componente padre lo maneje
      this.searchEvent.emit(this.searchTerm);
    }
  }
  
  onRestaurar() {
    this.searchTerm = ''; // Limpiar el término de búsqueda
    this.crudService.getByDescripcion('productos', '')
      .subscribe((response: Producto[]) => { // Asegúrate de que `response` es un arreglo de `Producto[]`
        this.productos = response || []; // Asignar directamente el arreglo de productos
        console.log('Productos restaurados:', this.productos);
      });
    this.searchEvent.emit(''); // Emitir el término de búsqueda vacío
  }
  
}

