import { Component } from '@angular/core';
import { FormaDePago } from '../../../../models/formaDePago.entity.js';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CRUDService } from '../../../../api/crud.service.js';
import { AsyncPipe } from '@angular/common';
import { DUIButton, DUIDialog } from 'david-ui-angular';
import { PersonaAddComponent } from '../../personas/persona-add/persona-add.component.js';

@Component({
  selector: 'app-admin-formas-de-pago',
  standalone: true,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    DUIDialog,
    PersonaAddComponent,
    DUIButton,
  ],
  templateUrl: './admin-formas-de-pago.component.html',
  styleUrl: './admin-formas-de-pago.component.css',
})
export class AdminFormasDePagoComponent {
  formasDePago$ = this.crudService.$;
  openDialog = false;
  openAddDialog = false;
  isUpdating = false;
  idEdited: string | undefined = undefined;
  formaDePagoToDelete: FormaDePago | undefined = undefined;

  addForm = new FormGroup({
    descripcion: new FormControl('', { nonNullable: true }),
  });

  constructor(private crudService: CRUDService<FormaDePago>) {
    this.crudService.getAll('formas-de-pago');
  }

  OpenDialog(formaDePago: FormaDePago) {
    this.openDialog = !this.openDialog;
    this.formaDePagoToDelete = formaDePago;
  }

  OpenAddDialog(formaDePago?: FormaDePago) {
    this.isUpdating = false;
    this.idEdited = undefined;
    this.addForm.reset();
    if (formaDePago) {
      this.isUpdating = true;
      this.idEdited = formaDePago.id;
      this.addForm.controls.descripcion.setValue(formaDePago.descripcion);
    }
    this.openAddDialog = true;
  }

  delete(formaDePago: FormaDePago) {
    this.crudService.deleteOne('formas-de-pago', formaDePago).subscribe();
    this.openDialog = !this.openDialog;
  }

  submitForm() {
    const formaDePago: FormaDePago = {
      id: this.idEdited ?? '',
      descripcion: this.addForm.value.descripcion ?? '',
    };
    if (this.isUpdating === false) {
      this.crudService.add('formas-de-pago', formaDePago);
    } else {
      this.crudService.update('formas-de-pago', formaDePago);
    }
    this.openAddDialog = !this.openAddDialog;
  }
}
