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

    const passwordNueva = this.passwordForm.value.nuevaPassword ?? '';


    this.personaService.resetPassword(this.token, passwordNueva).subscribe({
      next: (response: Response) => {
        this.mensajeExito = 'Contraseña cambiada con exito';
        this.contraseniaCambiada = true;
        this.router.navigate(['/login']);
      },
      error: (error: any) => {
         this.mensajeError = 'Error al actualizar la contraseña.';
            setTimeout(() => (this.mensajeError = ''), 4000);
            this.contraseniaCambiada = false;
        console.error('No se pudo cambiar la contraseña', error);
      }
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

