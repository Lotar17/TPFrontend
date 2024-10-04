import { Component, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CRUDService } from '../api/crud.service.js';

@Component({
  selector: 'app-cargo-productos',
  standalone: true,
  imports: [],
  templateUrl: './cargo-productos.component.html',
  styleUrl: './cargo-productos.component.css'
})
export class CargoProductosComponent {
publicaForm= new FormGroup({
  descripcion: new FormControl(),
  precio: new FormControl(),
  stock: new FormControl(),
  categoria: new FormControl()
})
crudService = inject(CRUDService<Producto>)

}
