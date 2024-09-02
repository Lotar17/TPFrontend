import { Component } from '@angular/core';
import { LoginService } from '../api/login.service.js';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { response} from 'express';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio-sesion',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './inicio-sesion.component.html',
  styleUrl: './inicio-sesion.component.css',
})
export class InicioSesionComponent {
  loginForm = new FormGroup({
    mail: new FormControl(),
    password: new FormControl(),
  });

  constructor(private loginService: LoginService,private router:Router) {}

  async onSubmit() {
    const credentials = {
      mail: this.loginForm.value.mail ?? '',
      password: this.loginForm.value.password ?? '',
    };
    (await this.loginService.login(credentials)).subscribe((response) => {
      if(response.result){
        console.log(response.message)
        this.router.navigateByUrl('/dashboard')//se redirije a DASHBOARD
      }else{
        console.error(response.message);
      }
    } )
  }
}
