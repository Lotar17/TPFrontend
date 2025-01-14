import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { FormGroup,FormControl, ReactiveFormsModule } from '@angular/forms';
import { RegisterService } from '../api/register.service.js';
import { response } from 'express';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
registerForm = new FormGroup({
  name :new FormControl(),
  surname: new FormControl(),
  mail: new FormControl(),
  password: new FormControl(),
  phone: new FormControl(),
  rol: new FormControl(),
});

constructor(private registerService : RegisterService, private router:Router){}
async onSubmit(){
  const credentials = {
    nombre:this.registerForm.value.name ?? '',
    telefono:this.registerForm.value.phone ?? '',
    password:this.registerForm.value.password ?? '',
    apellido:this.registerForm.value.surname ?? '',
    mail:this.registerForm.value.mail ?? '',
    rol:this.registerForm.value.rol ?? ''
  };
  try{
    (await this.registerService.register(credentials)).subscribe((response)=>{
      if (response.result){
        console.log(response.message);
        this.router.navigateByUrl('/login')
      }
    });
  } catch(error){}
}
}
