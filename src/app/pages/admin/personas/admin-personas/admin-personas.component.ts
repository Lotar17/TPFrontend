import { Component, inject } from '@angular/core';
import { PersonasService } from '../../../../api/personas.service.js';
import { Observable } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Persona } from '../../../../models/persona.entity.js';
import { AsyncPipe } from '@angular/common';
import { ApiResponse } from '../../../../models/ApiResponse.js';
import { DUIDialog, DUIButton } from 'david-ui-angular';
import { PersonaAddComponent } from '../persona-add/persona-add.component.js';

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

  openDialog = false;

  openAddDialog = false;

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

  OpenAddDialog() {
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
    this.personaService
      .add(
        this.addForm.value.nombre ?? '',
        this.addForm.value.apellido ?? '',
        this.addForm.value.email ?? '',
        this.addForm.value.telefono ?? '',
        this.addForm.value.contrasena ?? '',
        this.addForm.value.rol ?? ''
      )
      .subscribe();
    this.openAddDialog = !this.openAddDialog;
    this.personaService.getAll();
  }
}
