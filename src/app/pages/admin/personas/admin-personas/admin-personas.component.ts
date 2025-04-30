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
import { Localidad } from '../../../../models/localidad.entity.js';
import { LocalidadService } from '../../../../api/localidad.service.js';
import { Direccion } from '../../../../models/direccion.entity.js';

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
  localidadService = inject(LocalidadService);
  localidades$ = this.localidadService.$;
  personas$ = this.crudService.$;
  personasActualizadas = outputFromObservable(this.personas$);
  openDialog = false;
  openAddDialog = false;
  isUpdating = false;
  idEdited: string | undefined = undefined;
  personaToDelete: Persona | undefined = undefined;

  addForm = new FormGroup({
    nombre: new FormControl('', { nonNullable: true }),
    apellido: new FormControl('', { nonNullable: true }),
    email: new FormControl('', { nonNullable: true }),
    telefono: new FormControl(''),
    contrasena: new FormControl('', { nonNullable: true }),
    rol: new FormControl('Usuario', { nonNullable: true }),
    localidad: new FormControl(),
    calle: new FormControl('', { nonNullable: true }),
    numero: new FormControl(),
  });

  constructor() {
    this.crudService.getAll('personas');
    this.localidadService.getAll('localidad');
  }

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
      this.addForm.controls.localidad.setValue(persona.direccion?.localidad);
      this.addForm.controls.calle.setValue(persona.direccion?.calle!);
      this.addForm.controls.numero.setValue(persona.direccion?.numero);
      this.addForm.controls.telefono.setValue(persona.telefono);
    }
    this.openAddDialog = true;
  }

  delete(persona: Persona) {
    this.crudService.deleteOne('personas', persona).subscribe();
    this.openDialog = !this.openDialog;
  }

  submitForm() {
    const direccion: Direccion = {
      idLocalidad: this.addForm.value.localidad,
      numero: this.addForm.value.numero,
      calle: this.addForm.value.calle!,
    };
    const persona: Persona = {
      id: this.idEdited ?? '',
      nombre: this.addForm.value.nombre ?? '',
      apellido: this.addForm.value.apellido ?? '',
      mail: this.addForm.value.email ?? '',
      telefono: this.addForm.value.telefono ?? '',
      password: this.addForm.value.contrasena ?? '',
      rol: this.addForm.value.rol ?? '',
      calle: this.addForm.value.calle,
      numero: this.addForm.value.numero,
      localidadId: this.addForm.value.localidad,
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
