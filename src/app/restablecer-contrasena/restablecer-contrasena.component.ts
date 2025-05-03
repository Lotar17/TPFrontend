import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import {jwtDecode} from 'jwt-decode';
import { PersonaService } from '../api/per.service.js';


@Component({
  selector: 'app-restablecer-contrasena',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './restablecer-contrasena.component.html',
  styleUrl: './restablecer-contrasena.component.css'
})
export class RestablecerContrasenaComponent implements OnInit {
  modalContrasenia=false
  contraseniaCambiada=false
  mensajeExito=''
  mensajeError=''
  passwordForm = new FormGroup({
    nuevaPassword: new FormControl('', [Validators.required])
  });

  token: string = '';
  tokenValido: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private personaService: PersonaService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] ?? '';
      console.log('TOKEN:', this.token); // chekeo que llegue bien
      try {
        const payload: any = jwtDecode(this.token);
        const ahora = Math.floor(Date.now() / 1000);
        this.tokenValido = payload.exp > ahora;
      } catch (e) {
        this.tokenValido = false;
      }
    });
  }

  onSubmit() {
    if (!this.tokenValido) {
      alert('Token inválido o formulario incompleto');
      return;
    }

    const nuevaPassword = this.passwordForm.value.nuevaPassword ?? '';
    const payload: any = jwtDecode(this.token);
    const id = payload.id;

    this.personaService.getOne(id).subscribe({
      next: (res) => {
        const persona = res.data;
        if (!persona) {
          alert('No se encontró al usuario');
          return;
        }
        persona.password = nuevaPassword;

        this.personaService.updatePersona(persona).subscribe({
          next: () => {
            this.mensajeExito = 'Contraseña cambiada con exito';
            this.contraseniaCambiada = true; // variable para mostrar el mensaje de exito
            this.mensajeError = '';
            setTimeout(() => (this.contraseniaCambiada = false), 4000);
    
            this.router.navigate(['/login']);
          },
          error: () =>{ 
            this.mensajeError = 'Error al actualizar la contraseña.';
            setTimeout(() => (this.mensajeError = ''), 4000);
            this.contraseniaCambiada = false;
          }
        });
      },
      error: () => alert('No se encontró al usuario')
    });
  }
  
abrirModalContrasenia(){
  this.modalContrasenia=true
}
confirmaContrasenia(){
  this.modalContrasenia=false
  this.onSubmit()
}
cancelarContrasenia(){
  this.modalContrasenia=false
}
}

