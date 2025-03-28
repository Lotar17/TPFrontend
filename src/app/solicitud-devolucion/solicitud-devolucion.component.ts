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
import { ProductosService } from '../api/producto.service';
import { ComprasService } from '../api/compra.service';
import { Compra } from '../models/compra.entity';
import { HistoricoPrecioService } from '../api/calculaprecio.service';
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
motivo!:string;
cantidadDevuelta!:number;
stockNuevo!:number;
productoActualizado!:Producto
compra!:Compra
stockProducto!:number
precioActual!:number
totalAnterior!:number
valorCompra!:number
compraActualizada!:number
subotal!:number
  constructor(
private itemService:ItemService,
private autenticacionService:AutenticacionService,
private personaService:PersonaService,
private solicitudService:SolicitudService,
private productoService:ProductosService,
private historicoPrecioService:HistoricoPrecioService

  ){}

  publicaForm= new FormGroup({
motivoDevolucion: new FormControl,
cantidadDevuelta:new FormControl

  })

  ngOnInit(){
this.item=this.itemService.getItem()
if(this.item.compra)
this.compra=this.item.compra
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
async onSubmit() {
  this.motivo = this.publicaForm.value.motivoDevolucion;
  this.cantidadDevuelta=this.publicaForm.value.cantidadDevuelta

  console.log('Motivo:', this.motivo);
  console.log('Item ID:', this.item1.id); 
  console.log('Cantidad devuelta',this.cantidadDevuelta)
if(this.item1.id)
  this.solicitudService.createDevolutionRequest(this.item1.id, this.motivo,this.cantidadDevuelta).subscribe({
    next: (response: any) => {
      console.log('Solicitud creada con éxito', response.data);

      


},error:(error:any)=>{
  console.error("La solicitud no se pudo crear",error)
}

  
  })
}}
//ACA SOLO CREA LA SOLICITUD DE DEVOLUCION POR EL CLIENTE