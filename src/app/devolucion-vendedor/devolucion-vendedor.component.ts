import { Component } from '@angular/core';
import { SolicitudService } from '../api/solicitud.service';
import { Devolucion } from '../models/solicitudDevolucion.entity';
import { AutenticacionService } from '../api/autenticacion.service';
import { response } from 'express';
import { error } from 'console';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-devolucion-vendedor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './devolucion-vendedor.component.html',
  styleUrl: './devolucion-vendedor.component.css'
})
export class DevolucionVendedorComponent {
idVendedor!:string
solicitudes:Devolucion[]=[];
idSolicitud!:string;
estadoSolicitud!:string

constructor(
private autenticacionService:AutenticacionService,
private solicitudService:SolicitudService

){}

ngOnInit(){
this.autenticacionService.getUserInformation().subscribe({
 next:(response:any)=>{
this.idVendedor=response.data.id

if(this.idVendedor)
  this.solicitudService.getVendedorRequest(this.idVendedor).subscribe({
next:(response:any)=>{
this.solicitudes=response.data

}


  })


 },
 error:(error:any) =>{
  console.error("salmflfd",error)
 }
})


}
requestDecission(idSolicitud:string,decision:string){
this.solicitudService.makeDecission(idSolicitud,decision).subscribe({
next:(response:any)=>{
console.log('Solicitud aprobada/rechazada con exito',response.data)

},
error:(error:any)=>{
  console.error("No se realizo la solicitud",error)
}



})
  


}


}
