import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CRUDService } from '../api/crud.service.js';
import { Producto } from '../models/producto.entity.js';
import { AuthService } from '../api/Auth.service.js';

@Component({
  selector: 'app-cargo-productos',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './cargo-productos.component.html',
  styleUrl: './cargo-productos.component.css',
})
export class CargoProductosComponent {
  publicaForm = new FormGroup({
    descripcion: new FormControl(),
    precio: new FormControl(),
    stock: new FormControl(),
    categoria: new FormControl(),
  });
  constructor(
    private crudService: CRUDService<Producto>,
    private authService: AuthService // Inyectar AuthService
  ) {}
  async onSubmit() {
    const userId = this.authService.getUserId(); // Esto ahora devuelve string (o vacío)

    // Comprobar si el ID es válido
    if (!userId) {
      console.error('El usuario no está logueado.');
      // Manejar la situación de que el usuario no está logueado
      return;
    }

    const producto: Producto = {
      descripcion: this.publicaForm.value.descripcion,
      stock: this.publicaForm.value.stock,
      precio: this.publicaForm.value.precio,
      categoria: this.publicaForm.value.categoria, // Nombre de la categoría
      personaId: userId, // ID de la persona logueada
    };
    await this.crudService.add('productos', producto);
  }
}
