import { Component } from '@angular/core';
import { Persona } from '../models/persona.entity';
import { FormsModule } from '@angular/forms';
import { AutenticacionService } from '../api/autenticacion.service';
import { PersonaService } from '../api/per.service';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { HeaderComponent } from "../header/header.component";
import { SeguimientoService } from '../api/seguimiento.service';
import { Localidad } from '../models/localidad.entity';

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
  localidades:Localidad[]=[]
  mostrarFormularioDireccion: boolean = false;
  showModalConfirmacion: boolean = false;
  nuevaCalle: string = '';
  nuevoNumero: number | null = null;
  nuevaLocalidad: string = '';
  constructor(private autenticacionService:AutenticacionService,
    private personaService:PersonaService,
    private seguimientoService:SeguimientoService
  ){}

ngOnInit(){
  this.loadLocalidades()

  this.autenticacionService.getUserInformation().subscribe({
    next:(response:any)=>{
    this.usuarioId=response.data.id
    if (this.usuarioId)
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
  loadLocalidades(){
    this.seguimientoService.getLocalidades().subscribe({
    next:(response:any)=>{
    this.localidades=response.data
    },error:(error:any)=>{
      console.error('No se encontraron localidades',error)
    }})}


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
        this.errorMessage = ''; 
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

confirmarCambioDireccion() {
  this.showModalConfirmacion = true;
}

cancelarCambioDireccion() {
  this.mostrarFormularioDireccion = false;
  this.nuevaCalle = '';
  this.nuevoNumero = null;
  this.nuevaLocalidad = '';
}
cancelarConfirmacion() {
  this.showModalConfirmacion = false;
}
guardarNuevaDireccion() {
  if (!this.nuevaCalle || !this.nuevoNumero || !this.nuevaLocalidad) {
    alert('Todos los campos de la dirección son obligatorios');
    return;
  }

  this.personaService.actualizaDireccion(
    this.nuevaCalle,
    this.nuevoNumero!,
    this.nuevaLocalidad,
    this.usuario 
  )
   
      
      this.successMessage = 'Dirección actualizada correctamente';
      this.showModalConfirmacion = false;
      this.mostrarFormularioDireccion = false;
  
      
      this.errorMessage = 'Error al actualizar dirección';
      this.showModalConfirmacion = false;
    }
    datosValidos(): boolean {
      return !!this.editUsuario.nombre && 
             !!this.editUsuario.apellido && 
             !!this.editUsuario.mail && 
             !!this.editUsuario.telefono && 
             /^\d+$/.test(this.editUsuario.telefono);  // Solo números en teléfono
    }
 
validarDireccion(): boolean {
  return (
    !!this.nuevaCalle &&                    
    !!this.nuevoNumero &&                     
    !isNaN(this.nuevoNumero) &&               
    this.nuevoNumero > 0 &&                   
    !!this.nuevaLocalidad                     
  );
}

  };


