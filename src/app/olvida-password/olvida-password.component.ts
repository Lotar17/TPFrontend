import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PersonaService } from '../api/per.service.js';
import { CommonModule } from '@angular/common';
import { Validators } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-olvida-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink,CommonModule],
  templateUrl: './olvida-password.component.html',
  styleUrl: './olvida-password.component.css',
})
export class OlvidaPasswordComponent {
  modalCorreo = false;
correoEnviado = false;
mensajeExito = '';
mensajeError: string = '';
cargando = false;

  olvidaForm = new FormGroup({
    mail: new FormControl('', [Validators.required, Validators.email]),
  });

  constructor(private personaService: PersonaService,
    router:Router,
   private cdr:ChangeDetectorRef
  ) {}

  onSubmit() {
    const mail = this.olvidaForm.value.mail ?? '';
    console.log('Mail del form:', mail); // chekeo
    this.cargando = true
    this.personaService.getPersonaByEmail(mail).subscribe({
      next: (response) => {
        this.cargando = false;
        if (response.data) {
          this.mensajeExito = 'Correo enviado con éxito';
          this.correoEnviado = true; // variable para mostrar el mensaje de exito
          this.mensajeError = '';
          setTimeout(() => (this.correoEnviado = false), 4000);
          console.log(response.data);
        } else {
          this.mensajeError = 'No se encontró el usuario';
          this.correoEnviado = false;
        }
      },
      error: (error) => {
        this.cargando = false;
        console.error('Error al buscar usuario:', error);
        this.mensajeError = 'No se encontró ningún usuario con ese correo.';
        setTimeout(() => (this.mensajeError = ''), 4000);
        this.correoEnviado = false;
      }
    });
  }
  
abrirModalCorreo(){
  this.modalCorreo=true
}
confirmaCorreo(){
  this.modalCorreo=false
  this.cdr.detectChanges();
  this.onSubmit()
}
cancelarCorreo(){
  this.modalCorreo=false
}
}
