import { Component, inject, Output } from '@angular/core';
import { PersonasService } from '../../../../api/personas.service.js';
import { Observable } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Persona } from '../../../../models/persona.entity.js';
import { AsyncPipe } from '@angular/common';
import { ApiResponse } from '../../../../models/ApiResponse.js';
import { DUIDialog, DUIButton } from 'david-ui-angular';
import { PersonaAddComponent } from '../persona-add/persona-add.component.js';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { CRUDService } from '../../../../api/crud.service.js';

@Component({
  selector: 'app-admin-personas',
  standalone: true,
  imports: [
    AsyncPipe,
    DUIDialog,
    DUIButton,
    PersonaAddComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './admin-personas.component.html',
  styleUrl: './admin-personas.component.css',
})
export class AdminPersonasComponent {
  crudService = inject(CRUDService<Persona>);

  personas$ = this.crudService.$;
  personasActualizadas = outputFromObservable(this.personas$);

  openDialog = false;

  openAddDialog = false;

  isUpdating = false;
  idEdited: string | undefined = undefined;

  addForm = new FormGroup({
    nombre: new FormControl('', { nonNullable: true }),
    apellido: new FormControl('', { nonNullable: true }),
    email: new FormControl('', { nonNullable: true }),
    telefono: new FormControl(''),
    contrasena: new FormControl('', { nonNullable: true }),
    rol: new FormControl('Usuario', { nonNullable: true }),
  });

  personaToDelete: Persona | undefined = undefined;

  OpenDialog(persona: Persona) {
    this.openDialog = !this.openDialog;
    this.personaToDelete = persona;
  }

  OpenAddDialog(persona?: Persona) {
    this.isUpdating = false;
    this.idEdited = undefined;
    this.addForm.reset();
    if (persona) {
      this.isUpdating = true;
      this.idEdited = persona.id;
      this.addForm.controls.nombre.setValue(persona.nombre);
      this.addForm.controls.apellido.setValue(persona.apellido);
      this.addForm.controls.email.setValue(persona.mail);
      this.addForm.controls.rol.setValue(persona.rol!);
      this.addForm.controls.telefono.setValue(persona.telefono);
    }
    this.openAddDialog = true;
  }

  constructor() {
    this.crudService.getAll('personas');
  }

  delete(persona: Persona) {
    this.crudService.deleteOne('personas', persona).subscribe();
    this.openDialog = !this.openDialog;
  }

  submitForm() {
    const persona: Persona = {
      id: this.idEdited ?? '',
      nombre: this.addForm.value.nombre ?? '',
      apellido: this.addForm.value.apellido ?? '',
      mail: this.addForm.value.email ?? '',
      telefono: this.addForm.value.telefono ?? '',
      password: this.addForm.value.contrasena ?? '',
      rol: this.addForm.value.rol ?? '',
    };
    if (this.isUpdating === false) {
      this.crudService.add('personas', persona);
    } else {
      delete persona.password;
      this.crudService.update('personas', persona);
    }
    this.openAddDialog = !this.openAddDialog;
  }
}
