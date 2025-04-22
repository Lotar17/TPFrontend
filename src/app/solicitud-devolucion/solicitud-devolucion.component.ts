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
import { CorreoService } from '../api/correo.service';
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
idProducto!:string
  constructor(
private itemService:ItemService,
private autenticacionService:AutenticacionService,
private personaService:PersonaService,
private solicitudService:SolicitudService,
private productoService:ProductosService,
private historicoPrecioService:HistoricoPrecioService,
private correoService:CorreoService

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
console.log(this.item1.producto?.id)
if(this.item1.producto?.id)
  this.idProducto=this.item1.producto.id
if(this.idProducto)
  console.log('ID del producto antes de la petición:', this.idProducto);


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
      this.mostrarModalExito = true;
const mailDestinatario= response.data.vendedor.mail
const asunto= "Devolución Recibida"
const mensaje= `Usted ${response.data.vendedor.nombre} ${response.data.vendedor.apellido} recibio una solicitud de devolucion por parte de la siguiente persona:
${response.data.comprador.nombre} ${response.data.comprador.apellido} sobre el siguiente producto: ${response.data.item.producto.descripcion}
en una cantidad de ${response.data.cantidad_devuelta}. Vaya al panel de Mis publicaciones, dentro de este vaya a Mis Solicitudes, ahi podra
visualizar dicha solicitud de la cual debe optar por aceptar o rechazar`
this.correoService.sendEmail(mailDestinatario,asunto,mensaje).subscribe({
  next:(response:any)=>{
console.log('Correo enviado con exito a',mailDestinatario)
  },
  error:(error:any)=>{
  
    console.error("No se encontro el usuario",error)
  }
  

})
      


},error:(error:any)=>{
  console.error("La solicitud no se pudo crear",error)
}

  
  })
}
mostrarModalConfirmacion = false;
mostrarModalExito = false;

abrirModalConfirmacion() {
  this.mostrarModalConfirmacion = true;
}

cerrarModalConfirmacion() {
  this.mostrarModalConfirmacion = false;
}

confirmarDevolucion() {
  this.mostrarModalConfirmacion = false;

  // Validar antes de continuar
  if (this.publicaForm.valid) {
    this.onSubmit(); // Aquí se ejecuta tu lógica de devolución
  } else {
    this.publicaForm.markAllAsTouched(); // Esto fuerza mostrar errores si faltan campos
  }
}


cerrarModalExito() {
  this.mostrarModalExito = false;
  // Podés redirigir o limpiar el formulario si querés
}


}
//ACA SOLO CREA LA SOLICITUD DE DEVOLUCION POR EL CLIENTE