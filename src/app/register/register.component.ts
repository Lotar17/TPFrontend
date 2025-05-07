import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { FormGroup,FormControl, ReactiveFormsModule ,Validators} from '@angular/forms';
import { RegisterService } from '../api/register.service.js';
import { Localidad } from '../models/localidad.entity.js';
import { SeguimientoService } from '../api/seguimiento.service.js';
import { AsyncPipe,CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

localidades:Localidad[]=[]
registroExitoso:boolean=false

registerForm = new FormGroup({
  name: new FormControl('', Validators.required),
  surname: new FormControl('', Validators.required),
  mail: new FormControl('', [Validators.required, Validators.email]),
  password: new FormControl('', Validators.required),
  phone: new FormControl('', [
    Validators.required,
    Validators.pattern(/^\d+$/) // Solo números
  ]),
  calle: new FormControl('', Validators.required),
  numero: new FormControl('', [
    Validators.required,
    Validators.pattern(/^\d+$/) // Solo números
  ]),
  localidad: new FormControl('', Validators.required)
})

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
  
    calle:this.registerForm.value.calle?? '',
    numero:Number(this.registerForm.value.numero?? ''),
    localidadId:this.registerForm.value.localidad?? '' // prestar atencion aca

  };
  try{
    (await this.registerService.register(credentials)).subscribe((response)=>{
      if (response.result){
        console.log(response.message);
        this.registroExitoso=true
        this.router.navigateByUrl('/login')
      }
    });
  } catch(error){}
}
}
