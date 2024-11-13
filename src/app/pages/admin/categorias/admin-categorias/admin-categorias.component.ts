import { Component } from '@angular/core';
import { Categoria } from '../../../../models/categoria.entity.js';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { PersonaAddComponent } from '../../personas/persona-add/persona-add.component.js';
import { AsyncPipe } from '@angular/common';
import { DUIButton, DUIDialog } from 'david-ui-angular';
import { CategoriaService } from '../../../../api/categoria.service.js';

@Component({
  selector: 'app-admin-categorias',
  standalone: true,
  imports: [
    PersonaAddComponent,
    AsyncPipe,
    DUIDialog,
    DUIButton,
    ReactiveFormsModule,
  ],
  templateUrl: './admin-categorias.component.html',
  styleUrl: './admin-categorias.component.css',
})
export class AdminCategoriasComponent {
  categorias$ = this.crudService.$;
  openDialog = false;
  openAddDialog = false;
  isUpdating = false;
  idEdited: string | undefined = undefined;
  categoriaToDelete: Categoria | undefined = undefined;

  addForm = new FormGroup({
    descripcion: new FormControl('', { nonNullable: true }),
  });

  constructor(private crudService: CategoriaService) {
    this.crudService.getAll('categorias');
  }

  OpenDialog(categoria: Categoria) {
    this.openDialog = !this.openDialog;
    this.categoriaToDelete = categoria;
  }

  OpenAddDialog(categoria?: Categoria) {
    this.isUpdating = false;
    this.idEdited = undefined;
    this.addForm.reset();
    if (categoria) {
      this.isUpdating = true;
      this.idEdited = categoria.id;
      this.addForm.controls.descripcion.setValue(categoria.descripcion);
    }
    this.openAddDialog = true;
  }

  delete(categoria: Categoria) {
    this.crudService.deleteOne('categorias', categoria).subscribe();
    this.openDialog = !this.openDialog;
  }

  submitForm() {
    const categoria: Categoria = {
      id: this.idEdited ?? '',
      descripcion: this.addForm.value.descripcion ?? '',
    };
    if (this.isUpdating === false) {
      this.crudService.add('categorias', categoria);
    } else {
      this.crudService.update('categorias', categoria);
    }
    this.openAddDialog = !this.openAddDialog;
  }
}
