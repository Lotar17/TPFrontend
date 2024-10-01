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
  personaService = inject(PersonasService);

  personas$ = this.personaService.personas$;
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
    this.personaService.getAll();
  }

  delete(persona: Persona) {
    this.personaService.deleteOne(persona).subscribe();
    this.openDialog = !this.openDialog;
  }

  submitForm() {
    if (this.isUpdating === false) {
      console.log('NONONONONONONONONONONONONNONONONONONO');
      this.personaService.add(
        this.addForm.value.nombre ?? '',
        this.addForm.value.apellido ?? '',
        this.addForm.value.email ?? '',
        this.addForm.value.telefono ?? '',
        this.addForm.value.contrasena ?? '',
        this.addForm.value.rol ?? ''
      );
    } else {
      this.personaService.update(
        this.idEdited ?? '',
        this.addForm.value.nombre ?? '',
        this.addForm.value.apellido ?? '',
        this.addForm.value.email ?? '',
        this.addForm.value.telefono ?? '',
        this.addForm.value.rol ?? ''
      );
    }
    this.openAddDialog = !this.openAddDialog;
  }
}
