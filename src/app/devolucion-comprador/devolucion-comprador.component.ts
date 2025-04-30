import { Component } from '@angular/core';
import { AutenticacionService } from '../api/autenticacion.service';
import { SolicitudService } from '../api/solicitud.service';
import { Devolucion } from '../models/solicitudDevolucion.entity';
import { response } from 'express';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CorreoService } from '../api/correo.service';
import { HeaderComponent } from "../header/header.component";
import { SidebarComponent } from '../sidebar/sidebar.component';
@Component({
  selector: 'app-devolucion-comprador',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, SidebarComponent],
  templateUrl: './devolucion-comprador.component.html',
  styleUrl: './devolucion-comprador.component.css'
})
export class DevolucionCompradorComponent {
  solicitudesComprador:Devolucion[]=[]
  idComprador!:string
  filtroEstado: string = '';
  destinatario!:string
  asunto!:string
  mensaje!:string
  confirmarEnvio:boolean=false
  solicitudSeleccionada!:Devolucion|null
  mostrarExito:boolean=false
 
  solicitudesFiltradas: Devolucion[] = [];
  solicitudesOriginal: any[] = []; 
  constructor(
private autenticacionService:AutenticacionService,
private solicitudService:SolicitudService,
private correoService:CorreoService
 ){}

 ngOnInit() {
  this.autenticacionService.getUserInformation().subscribe({
    next: (response: any) => {
      this.idComprador = response.data.id;
      if (this.idComprador)
        this.solicitudService.getCompradorRequest(this.idComprador).subscribe({
          next: (response: any) => {
            this.solicitudesComprador = response.data;
            this.solicitudesFiltradas = this.solicitudesComprador; 
          },
        });
    },
    error: (error: any) => {
      console.error('Usuario no encontrado', error);
    },
  });
}

filtrarSolicitudes() {
  const filtro = this.filtroEstado?.trim().toLowerCase();
  this.solicitudesFiltradas = this.solicitudesComprador.filter((s: any) =>
    s.estado.toLowerCase().includes(filtro)
  );
}

envioRealizado(solicitud:Devolucion){
 if(solicitud.vendedor)
   this. destinatario= solicitud.vendedor.mail
  

  const fecha_hora_actual= new Date().toString()
  if(solicitud.vendedor)
 
this. asunto='El envio del producto ha sido realizado correctamente'
this. mensaje=`La devolucion del producto ${solicitud.item.producto?.descripcion} ha sido enviado con el siguiente codigo de
devolucion ${solicitud.codigoConfirmacion} en la fecha y hora correspondiente: ${fecha_hora_actual}. Cuando reciba el producto vaya al 
apartado de solicitudes y clickee el boton llego el producto, desde ahi puede cerrar el proceso de devolucion y de manera inmediata
el cliente sera informado de dicha accion.`
if(solicitud.id && fecha_hora_actual)
this.solicitudService.cierreDevolucionCliente(solicitud.id,fecha_hora_actual).subscribe({
next:(response)=>{
  solicitud.fechaEnvioCliente = fecha_hora_actual;
console.log('Fecha de envio del cliente asignada con exito',response.data)
    this.correoService.sendEmail(this.destinatario,this.asunto,this.mensaje).subscribe({
      next:(response:any)=>{
    console.log('El correo se envio con exito al destinatario:',this.destinatario)
      },error:(error:any)=>{
        console.error('El correo no pudo ser enviado',error)
      }
    })},
    error:(error:any)=>{
console.error('La fecha de envio no se asigno',error)
    }})
}

abrirAccion(solicitud:Devolucion){
this.solicitudSeleccionada=solicitud
this.confirmarEnvio=true

}


confirmarAccion() {
  if(this.solicitudSeleccionada)
    this.envioRealizado(this.solicitudSeleccionada)
  this.confirmarEnvio=false
  this.mostrarExito=true
    setTimeout(() => {
      this.mostrarExito = false;
    }, 3000);
  }
  cancelarAccion(){
this.confirmarEnvio=false
this.solicitudSeleccionada=null
this.mostrarExito=false

  }
}



