import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import {jwtDecode} from 'jwt-decode';
import { PersonaService } from '../api/per.service.js';
import { Persona } from '../models/persona.entity'; // Asegurate de tener este modelo
import { ApiResponse } from '../models/ApiResponse'; // También este modelo

@Component({
  selector: 'app-restablecer-contrasena',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './restablecer-contrasena.component.html',
  styleUrl: './restablecer-contrasena.component.css'
})
export class RestablecerContrasenaComponent implements OnInit {
  passwordForm = new FormGroup({
    passwordNueva: new FormControl()
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

    const passwordNueva = this.passwordForm.value.passwordNueva ?? '';

    this.personaService.resetPassword(this.token, passwordNueva).subscribe({
      next: (response: ApiResponse<Persona>) => {
        console.log('Contraseña cambiada con exito', response.data);
        this.router.navigate(['/login']);
      },
      error: (error: any) => {
        console.error('No se pudo cambiar la contraseña', error);
      }
    });
  }

    
}

