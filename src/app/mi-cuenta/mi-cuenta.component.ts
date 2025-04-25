import { Component } from '@angular/core';
import { Persona } from '../models/persona.entity';
import { FormsModule } from '@angular/forms';
import { AutenticacionService } from '../api/autenticacion.service';
import { PersonaService } from '../api/per.service';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { HeaderComponent } from "../header/header.component";


@Component({
  selector: 'app-mi-cuenta',
  standalone: true,
  imports: [FormsModule, CommonModule, SidebarComponent, HeaderComponent],
  templateUrl: './mi-cuenta.component.html',
  styleUrl: './mi-cuenta.component.css'
})
export class MiCuentaComponent {
  usuarioId!:string
  usuario !:Persona
  errorMessage: string = '';
  passwordActual: string = '';
  nuevaPassword: string = '';
  mailUser!:string
  successMessage: string = '';

  constructor(private autenticacionService:AutenticacionService,
    private personaService:PersonaService,
    
  ){}

ngOnInit(){

  this.autenticacionService.getUserInformation().subscribe({
    next:(response:any)=>{
    this.usuarioId=response.data.id
    this.personaService.getOne(this.usuarioId).subscribe({
      next:(response:any)=>{
this.usuario=response.data
if(this.usuario){
  this.mailUser=this.usuario.mail
}
      },
      error:(error:any)=>{
      
        console.error("No se encontro el usuario",error)
      }
      
    })
    },
    error:(error:any)=>{
    
      console.error("No se encontro el usuario",error)
    }


})}
  showModalEditarDatos = false;
  showModalPassword = false;

  editUsuario = { ...this.usuario };
 


  updateDatosUsuario(usuario: Persona) {
    this.personaService.updatePersona(usuario).subscribe({
      next: (response: any) => {
        console.log('Datos del usuario actualizado con éxito', response.data);
        this.successMessage = 'Datos del usuario actualizados con exito';
       
      setTimeout(() => {
        this.successMessage = ''; 
      }, 5000);
        this.errorMessage = ''; 
      },
      error: (error: any) => {
        if (error.status === 400 && error.error && error.error.message) {
          this.errorMessage = 'Ya existe otro usuario con el mail ingresado';
        } else {
          alert('Ocurrió un error al actualizar los datos del usuario');
        }
        console.error('No se actualizó el usuario', error);
      }
    });
  }
  updatePassword(mailUser:string,passwordActual:string,passwordNueva:string){
this.personaService.updatePassword(mailUser,passwordActual,passwordNueva).subscribe({
  next:(response:any)=>{
console.log('Contraseña cambiada con exito',response.data)
this.successMessage = 'Contraseña cambiada con éxito';
      this.errorMessage = '';  
      setTimeout(() => {
        this.successMessage = ''; 
      }, 5000);
this.closeModal(); 
  },
  error:(error:any)=>{
    if (error.status === 400 && error.error.message === 'La contraseña o el usuario es incorrecto') {
      this.errorMessage = 'La contraseña actual no coincide con la ingresada';
    } else {
      this.errorMessage = 'Ocurrió un error al cambiar la contraseña';
    }
    this.successMessage = '';
    console.error("No se pudo cambiar la contraseña",error)
  }
})

  }
  


  openModalEditarDatos() {
    this.editUsuario = { ...this.usuario };
    this.showModalEditarDatos = true;
  }

  openModalPassword() {
    this.nuevaPassword = '';  
    this.passwordActual = '';  
    this.showModalPassword = true;
    this.errorMessage = '';
    this.successMessage = '';
  }


  guardarDatos() {
    this.usuario = { ...this.editUsuario };
    this.updateDatosUsuario(this.usuario)
    this.closeModal();
  }
  
  guardarPassword() {

    if (!this.passwordActual || !this.nuevaPassword) {
      this.errorMessage = 'Ambos campos son obligatorios';
      setTimeout(() => {
        this.errorMessage = ''; // El mensaje de error desaparecerá después de 5 segundos
      }, 5000);
      return;
    }
    else{
      this.updatePassword(this.mailUser,this.passwordActual,this.nuevaPassword)
    }
    
    
}
closeModal(){
  this.showModalEditarDatos = false;
  this.showModalPassword = false;
}
}