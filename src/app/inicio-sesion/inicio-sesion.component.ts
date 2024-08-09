import { Component } from '@angular/core';
import { LoginService } from '../api/login.service.js';
import {NgForm} from '@angular/forms'
import { response } from 'express';
import { error } from 'console';

@Component({
  selector: 'app-inicio-sesion',
  standalone: true,
  imports: [],
  templateUrl: './inicio-sesion.component.html',
  styleUrl: './inicio-sesion.component.css'
})
export class InicioSesionComponent {
  constructor(private loginService: LoginService){}

  onSumbit(form: NgForm){
    if(form.valid){
      this.loginService.login(form.value).subscribe({
        next: (response) => {
          console.log('login Exitoso:',response);},
          error: (error) => {
            console.error('error de Login:',error);
          }
        }
      )
    }
  }
}
