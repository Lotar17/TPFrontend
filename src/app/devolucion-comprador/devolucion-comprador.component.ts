import { Component } from '@angular/core';
import { AutenticacionService } from '../api/autenticacion.service';
import { SolicitudService } from '../api/solicitud.service';
import { Devolucion } from '../models/solicitudDevolucion.entity';
import { response } from 'express';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-devolucion-comprador',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './devolucion-comprador.component.html',
  styleUrl: './devolucion-comprador.component.css'
})
export class DevolucionCompradorComponent {
  solicitudesComprador:Devolucion[]=[]
  idComprador!:string

  constructor(
private autenticacionService:AutenticacionService,
private solicitudService:SolicitudService
 ){}

ngOnInit(){

this.autenticacionService.getUserInformation().subscribe({
next:(response:any)=>{
  this.idComprador=response.data.id
  if(this.idComprador)
    this.solicitudService.getCompradorRequest(this.idComprador).subscribe({
  next:(response:any)=>{
this.solicitudesComprador=response.data

  }
  
    })

},
error:(error:any)=>{
  console.error('Usuario no encontrado',error)
}


})

}

}
