import { Component } from '@angular/core';
import { Persona } from '../models/persona.entity';
import { FormsModule } from '@angular/forms';
import { AutenticacionService } from '../api/autenticacion.service';
import { PersonaService } from '../api/per.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-mi-cuenta',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './mi-cuenta.component.html',
  styleUrl: './mi-cuenta.component.css'
})
export class MiCuentaComponent {
  usuarioId!:string
  usuario !:Persona

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
  nuevaPassword = '';


updateDatosUsuario(usuario:Persona){
this.personaService.updatePersona(usuario).subscribe({
  next:(response:any)=>{
console.log('Datos del usuario actualizado con exito',response.data)
  },
  error:(error:any)=>{
  
    console.error("No se actualizo el usuario",error)
  }
})
}


  openModalEditarDatos() {
    this.editUsuario = { ...this.usuario };
    this.showModalEditarDatos = true;
  }

  openModalPassword() {
    this.nuevaPassword = '';
    this.showModalPassword = true;
  }



  guardarDatos() {
    this.usuario = { ...this.editUsuario };
    this.updateDatosUsuario(this.usuario)
    this.closeModal();
  }

  guardarPassword() {
    // Aún no implementado, aquí iría la lógica real para cambiar la contraseña
    console.log('Contraseña nueva:', this.nuevaPassword);
    this.closeModal();
  }
  closeModal() {
    this.showModalEditarDatos = false;
    this.showModalPassword = false;
  }

}
