import { Component } from '@angular/core';
import { LoginService } from '../api/login.service.js';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { response } from 'express';
import { Router } from '@angular/router';
import { AuthService } from '../api/Auth.service.js';

@Component({
  selector: 'app-inicio-sesion',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './inicio-sesion.component.html',
  styleUrl: './inicio-sesion.component.css',
})
export class InicioSesionComponent {
  loginSuccesful: boolean | undefined;

  loginForm = new FormGroup({
    mail: new FormControl(),
    password: new FormControl(),
  });

  constructor(private loginService: LoginService,private authService:AuthService, private router: Router) {}

  async onSubmit() {
    const credentials = {
      mail: this.loginForm.value.mail ?? '',
      password: this.loginForm.value.password ?? '',
    };
    try {
      (await this.loginService.login(credentials)).subscribe((response) => {
        if (response.result) {
          console.log(response.message);
          this.authService.setUserId(response.usuarioId);
          this.router.navigateByUrl('/productos'); //se redirije a DASHBOARD
        } else {
          this.loginSuccesful = false;
          // console.error(response.message);
        }
      });
    } catch (error) {
      this.loginSuccesful = false;
    }
  }
}
