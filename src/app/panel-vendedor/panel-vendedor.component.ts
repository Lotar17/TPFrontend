import { Component } from '@angular/core';
import { AuthService } from '../api/Auth.service';
import { PersonaService } from '../api/per.service';
import { Persona } from '../models/persona.entity';
import { Producto } from '../models/producto.entity';
import { CRUDService } from '../api/crud.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-panel-vendedor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './panel-vendedor.component.html',
  styleUrl: './panel-vendedor.component.css'
})
export class PanelVendedorComponent {
productos?:Producto[]=[]
idUser!:string
user!:Persona
constructor(
private personaService:PersonaService,
private authService:AuthService
){}

ngOnInit(){
this.idUser= this.authService.getUserId()// debo usar autenticacion
console.log(this.idUser)

this.personaService.getOne( this.idUser).subscribe({
  next:(response:any)=>{
this.user=response.data
if(this.user){
  this.productos=this.user.prods_publicados
  console.log(this.user)
}else{
  this.productos=[]
}

}, error: (error)=> {
  console.error('Error al obtener la comora',error)
}

})

}}
