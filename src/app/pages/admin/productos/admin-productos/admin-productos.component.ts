import { Component } from '@angular/core';
import { CRUDService } from '../../../../api/crud.service.js';
import { Producto } from '../../../../models/producto.entity.js';
import { AsyncPipe } from '@angular/common';
import { DUIDialog, DUIButton } from 'david-ui-angular';
import { ReactiveFormsModule } from '@angular/forms';
import { PersonaAddComponent } from '../../personas/persona-add/persona-add.component.js';
import { FormGroup, FormControl } from '@angular/forms';
import { Persona } from '../../../../models/persona.entity.js';
import { Categoria } from '../../../../models/categoria.entity.js';
import { CategoriaService } from '../../../../api/categoria.service.js';
import { IsStringPipe } from '../../../../is-string.pipe.js';

@Component({
  selector: 'app-admin-productos',
  standalone: true,
  imports: [
    AsyncPipe,
    DUIDialog,
    DUIButton,
    PersonaAddComponent,
    ReactiveFormsModule,
    IsStringPipe,
  ],
  templateUrl: './admin-productos.component.html',
  styleUrl: './admin-productos.component.css',
})
export class AdminProductosComponent {
  productos$ = this.crudService.$;
  categorias$ = this.categoriaService.$;
  openDialog = false;
  openAddDialog = false;
  isUpdating = false;
  idEdited: string | undefined = undefined;
  productoToDelete: Producto | undefined;

  constructor(
    private crudService: CRUDService<Producto>,
    private categoriaService: CategoriaService
  ) {
    this.crudService.getAll('productos');
    this.categoriaService.getAll('categorias');
  }

  addForm = new FormGroup({
    descripcion: new FormControl('', { nonNullable: true }),
    stock: new FormControl(0, { nonNullable: true }),
    categoriaId: new FormControl('', { nonNullable: true }),
    personaId: new FormControl('', { nonNullable: true }),
    precio: new FormControl(0, { nonNullable: true }),
  });

  OpenDialog(producto: Producto) {
    this.openDialog = !this.openDialog;
    this.productoToDelete = producto;
  }

  OpenAddDialog(producto?: Producto) {
    this.isUpdating = false;
    this.idEdited = undefined;
    this.addForm.reset();
    if (producto) {
      this.isUpdating = true;
      this.idEdited = producto.id;
      this.addForm.controls.descripcion.setValue(producto.descripcion);
      this.addForm.controls.stock.setValue(producto.stock ?? 0);
      this.addForm.controls.personaId.setValue(producto.persona?.id ?? '');
      this.addForm.controls.categoriaId.setValue(producto.categoria?.id ?? '');
      this.addForm.controls.precio.setValue(
        producto.hist_precios?.at(producto.hist_precios!.length - 1)?.valor!
      );
    }
    this.openAddDialog = true;
  }

  delete(producto: Producto) {
    this.crudService.deleteOne('productos', producto).subscribe();
    this.openDialog = !this.openDialog;
  }

  submitForm() {
    const categoria: Categoria = {
      id: this.addForm.value.categoriaId ?? '',
      descripcion: '',
    };
    const producto: Producto = {
      id: this.idEdited ?? '',
      descripcion: this.addForm.value.descripcion ?? '',
      stock: this.addForm.value.stock ?? 0,
      categoriaId: this.addForm.value.categoriaId ?? '',
      personaId: this.addForm.value.personaId ?? '',
      precio: this.addForm.value.precio ?? 0,
    };
    if (this.isUpdating === false) {
      this.crudService.add('productos', producto);
    } else {
      this.crudService.update('productos', producto);
    }
    this.openAddDialog = !this.openAddDialog;
  }
}
