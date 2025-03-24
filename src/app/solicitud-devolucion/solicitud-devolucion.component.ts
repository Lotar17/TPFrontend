import { Component } from '@angular/core';
import { ItemService } from '../api/item.service';
import { Item } from '../models/item.entity';
import { AutenticacionService } from '../api/autenticacion.service';
import { response } from 'express';
import { PersonaService } from '../api/per.service';
import { Persona } from '../models/persona.entity';
import { error } from 'console';
import { CommonModule } from '@angular/common';
import { Producto } from '../models/producto.entity';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SolicitudService } from '../api/solicitud.service';
@Component({
  selector: 'app-solicitud-devolucion',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './solicitud-devolucion.component.html',
  styleUrl: './solicitud-devolucion.component.css'
})
export class SolicitudDevolucionComponent {
item!:Item;
item1!:Item;
idUsuario!:string;
usuario!:Persona;
vendedor!:Persona;
producto!:Producto;
motivo!:string
  constructor(
private itemService:ItemService,
private autenticacionService:AutenticacionService,
private personaService:PersonaService,
private solicitudService:SolicitudService

  ){}

  publicaForm= new FormGroup({
motivoDevolucion: new FormControl

  })

  ngOnInit(){
this.item=this.itemService.getItem()
if (this.item.id)
  this.itemService.getOne(this.item.id).subscribe({
next:(response:any)=>{
this.item1=response.data
console.log(this.item1)
if(this.item1.producto?.persona)
this.vendedor=this.item1.producto?.persona
},error:(error:any)=>{
  console.error('No se encontro el item',error)
}
 })
}
 async onSubmit(){
  this.motivo=this.publicaForm.value.motivoDevolucion

  console.log('Motivo:', this.motivo);
  console.log('Item:', this.item1); 
this.solicitudService.createDevolutionRequest(this.item1,this.motivo).subscribe({
next:(response:any)=>{
console.log('Solicitud creada con exito',response.data)

},
error:(error:any)=>{
  console.error('Error en la creacion de la solicitud',error)
}



})



}
}
