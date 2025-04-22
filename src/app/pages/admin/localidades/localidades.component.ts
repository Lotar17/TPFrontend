import { Component } from '@angular/core';
import { Localidad } from '../../../models/localidad.entity.js';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CRUDService } from '../../../api/crud.service.js';
import { LocalidadService } from '../../../api/localidad.service.js';
import { AsyncPipe } from '@angular/common';
import { PersonaAddComponent } from '../personas/persona-add/persona-add.component.js';
import { DUIButton, DUIDialog } from 'david-ui-angular';

@Component({
  selector: 'app-localidades',
  standalone: true,
  imports: [
    AsyncPipe,
    PersonaAddComponent,
    DUIDialog,
    DUIButton,
    ReactiveFormsModule,
  ],
  templateUrl: './localidades.component.html',
  styleUrl: './localidades.component.css',
})
export class LocalidadesComponent {
  localidades$ = this.crudService.$;
  openDialog = false;
  openAddDialog = false;
  isUpdating = false;
  idEdited: string | undefined = undefined;
  localidadToDelete: Localidad | undefined = undefined;

  addForm = new FormGroup({
    nombre: new FormControl('', { nonNullable: true }),
    codigoPostal: new FormControl('', { nonNullable: true }),
    provincia: new FormControl('', { nonNullable: true }),
  });

  constructor(private crudService: LocalidadService) {
    this.crudService.getAll('localidad');
  }

  OpenDialog(localidad: Localidad) {
    this.openDialog = !this.openDialog;
    this.localidadToDelete = localidad;
  }

  OpenAddDialog(localidad?: Localidad) {
    this.isUpdating = false;
    this.idEdited = undefined;
    this.addForm.reset();
    if (localidad) {
      this.isUpdating = true;
      this.idEdited = localidad.id;
      this.addForm.controls.nombre.setValue(localidad.nombre);
      this.addForm.controls.codigoPostal.setValue(
        localidad.codigoPostal.toString()
      );
      this.addForm.controls.provincia.setValue(localidad.provincia);
    }
    this.openAddDialog = true;
  }

  delete(localidad: Localidad) {
    this.crudService.deleteOne('localidad', localidad).subscribe();
    this.openDialog = !this.openDialog;
  }

  submitForm() {
    const localidad: Localidad = {
      id: this.idEdited ?? '',
      nombre: this.addForm.value.nombre ?? '',
      codigoPostal: Number(this.addForm.value.codigoPostal) ?? undefined,
      provincia: this.addForm.value.provincia ?? '',
    };
    if (this.isUpdating === false) {
      this.crudService.add('localidad', localidad);
    } else {
      this.crudService.update('localidad', localidad);
    }
    this.openAddDialog = !this.openAddDialog;
  }
}
