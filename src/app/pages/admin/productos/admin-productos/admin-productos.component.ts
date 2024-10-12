import { Component } from '@angular/core';
import { CRUDService } from '../../../../api/crud.service.js';
import { Producto } from '../../../../models/producto.entity.js';
import { AsyncPipe } from '@angular/common';
import { DUIDialog, DUIButton } from 'david-ui-angular';
import { ReactiveFormsModule } from '@angular/forms';
import { PersonaAddComponent } from '../../personas/persona-add/persona-add.component.js';
import { FormGroup, FormControl } from '@angular/forms';
import { Persona } from '../../../../models/persona.entity.js';

@Component({
  selector: 'app-admin-productos',
  standalone: true,
  imports: [
    AsyncPipe,
    DUIDialog,
    DUIButton,
    PersonaAddComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './admin-productos.component.html',
  styleUrl: './admin-productos.component.css',
})
export class AdminProductosComponent {
  productos$ = this.crudService.$;
  openDialog = false;
  openAddDialog = false;
  isUpdating = false;
  idEdited: string | undefined = undefined;
  productoToDelete: Producto | undefined;

  constructor(private crudService: CRUDService<Producto>) {
    crudService.getAll('productos');
  }

  addForm = new FormGroup({
    descripcion: new FormControl('', { nonNullable: true }),
    stock: new FormControl(0, { nonNullable: true }),
    categoriaId: new FormControl('', { nonNullable: true }),
    personaId: new FormControl('', { nonNullable: true }),
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
      this.addForm.controls.stock.setValue(producto.stock);
      this.addForm.controls.categoriaId.setValue(producto.categoria);
      this.addForm.controls.personaId.setValue(producto.persona?.id!);
    }
    this.openAddDialog = true;
  }

  delete(producto: Producto) {
    this.crudService.deleteOne('productos', producto).subscribe();
    this.openDialog = !this.openDialog;
  }

  submitForm() {
    const persona: Persona = {
      id: this.addForm.value.personaId ?? '',
      nombre: '',
      apellido: '',
      mail: '',
      telefono: '',
    };
    const producto: Producto = {
      id: this.idEdited ?? '',
      descripcion: this.addForm.value.descripcion ?? '',
      stock: this.addForm.value.stock ?? 0,
      categoria: this.addForm.value.categoriaId ?? '',
      persona: persona,
    };
    if (this.isUpdating === false) {
      this.crudService.add('productos', producto);
    } else {
      this.crudService.update('productos', producto);
    }
    this.openAddDialog = !this.openAddDialog;
  }
}
