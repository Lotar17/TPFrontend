import { Component } from '@angular/core';
import { LoginService } from '../api/login.service.js';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { response } from 'express';
import { Router,RouterLink} from '@angular/router';
import { AuthService } from '../api/Auth.service.js';
import { PersonaService } from '../api/per.service.js';

@Component({
  selector: 'app-olvida-password',
  standalone: true,
  imports: [ReactiveFormsModule,RouterLink],
  templateUrl: './olvida-password.component.html',
  styleUrl: './olvida-password.component.css'
})

export class OlvidaPasswordComponent {
  olvidaForm = new FormGroup({
    mail: new FormControl()
  })

  constructor(private personaService: PersonaService) {}

  onSubmit() {
    const mail = this.olvidaForm.value.mail ?? '';
    try{
      (this.personaService.getPersonaByEmail(mail)).subscribe((response) => {
      if(response.data){
        console.log(response.data);
      }else{
        console.log('No se encontro el usuario');
      }
      
    });
    }catch(error){}
  }
}
