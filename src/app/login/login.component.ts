import { Component } from '@angular/core';
import { InicioSesionComponent } from '../inicio-sesion/inicio-sesion.component.js';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [InicioSesionComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

}
