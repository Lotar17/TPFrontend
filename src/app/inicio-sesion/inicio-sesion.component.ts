import { Component } from '@angular/core';
import { LoginService } from '../api/login.service.js';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

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

  constructor(private loginService: LoginService) {}

  async onSubmit() {
    const credentials = {
      mail: this.loginForm.value.mail ?? '',
      password: this.loginForm.value.password ?? '',
    };
    const observable = await this.loginService.login(credentials);
    observable.subscribe((observable) => {
      console.log(observable);
    });
  }
}
