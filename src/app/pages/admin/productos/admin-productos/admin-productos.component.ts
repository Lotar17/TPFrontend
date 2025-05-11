import { Component } from '@angular/core';
import { CRUDService } from '../../../../api/crud.service.js';
import { Producto } from '../../../../models/producto.entity.js';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { DUIDialog, DUIButton } from 'david-ui-angular';
import { ReactiveFormsModule } from '@angular/forms';
import { PersonaAddComponent } from '../../personas/persona-add/persona-add.component.js';
import { FormGroup, FormControl } from '@angular/forms';
import { Persona } from '../../../../models/persona.entity.js';
import { Categoria } from '../../../../models/categoria.entity.js';
import { CategoriaService } from '../../../../api/categoria.service.js';

@Component({
  selector: 'app-admin-productos',
  standalone: true,
  imports: [
    AsyncPipe,
    DUIDialog,
    DUIButton,
    PersonaAddComponent,
    ReactiveFormsModule,
    CurrencyPipe,
  ],
  templateUrl: './admin-productos.component.html',
  styleUrl: './admin-productos.component.css',
})
export class AdminProductosComponent {
  productos$ = this.crudService.$;
  categorias$ = this.categoriaService.$;
  openDialog = false;
  productoToDelete: Producto | undefined;

  constructor(
    private crudService: CRUDService<Producto>,
    private categoriaService: CategoriaService
  ) {
    this.crudService.getAll('productos');
    this.categoriaService.getAll('categorias');
  }

  OpenDialog(producto: Producto) {
    this.openDialog = !this.openDialog;
    this.productoToDelete = producto;
  }

  delete(producto: Producto) {
    this.crudService.deleteOne('productos', producto).subscribe();
    this.openDialog = !this.openDialog;
  }
}
