import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { FormGroup,FormControl, ReactiveFormsModule } from '@angular/forms';
import { RegisterService } from '../api/register.service.js';
import { response } from 'express';
import { Localidad } from '../models/localidad.entity.js';
import { SeguimientoService } from '../api/seguimiento.service.js';
import { AsyncPipe,CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

localidades:Localidad[]=[]

registerForm = new FormGroup({
  name :new FormControl(),
  surname: new FormControl(),
  mail: new FormControl(),
  password: new FormControl(),
  phone: new FormControl(),
  rol: new FormControl(),
  calle:new FormControl(),
  numero:new FormControl(),
  localidad:new FormControl()
});

constructor(private registerService : RegisterService, private router:Router,
  private seguimientoService:SeguimientoService
){}

ngOnInit(){
this.seguimientoService.getLocalidades().subscribe({
  next:(response:any)=>{
this.localidades=response.data
console.log('Localidades encontradas:',response.data)
  },
  error:(error:any)=>{
  console.error("No se encontraron localidades",error)
  }
  })
}

async onSubmit(){
  const credentials = {
    nombre:this.registerForm.value.name ?? '',
    telefono:this.registerForm.value.phone ?? '',
    password:this.registerForm.value.password ?? '',
    apellido:this.registerForm.value.surname ?? '',
    mail:this.registerForm.value.mail ?? '',
    rol:this.registerForm.value.rol ?? '',
    calle:this.registerForm.value.calle?? '',
    numero:this.registerForm.value.numero?? '',
    localidadId:this.registerForm.value.localidad?? '' // prestar atencion aca

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
