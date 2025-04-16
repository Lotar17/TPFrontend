import { Component } from '@angular/core';
import { AutenticacionService } from '../../api/autenticacion.service';
import { SeguimientoService } from '../../api/seguimiento.service';
import { Seguimiento } from '../../models/seguimiento.entity';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-panel-seguimiento-cliente',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './panel-seguimiento-cliente.component.html',
  styleUrl: './panel-seguimiento-cliente.component.css'
})
export class PanelSeguimientoClienteComponent {
seguimientosCliente:Seguimiento[]=[]
idCliente!:string
codigoBusqueda!:number
seguimientoEncontrado: any = null;
busquedaRealizada: boolean = false;
constructor(private autenticacionService:AutenticacionService,
  private seguimientoService:SeguimientoService
)
{}

ngOnInit(){
  this.autenticacionService.getUserInformation().subscribe({
    next:(response:any)=>{
    
this.idCliente=response.data.id
console.log('Id del cliente',this.idCliente)
if (this.idCliente) {
  this.seguimientoService.getseguimientosCliente(this.idCliente);
  
  
  this.seguimientoService.seguimientosCLiente$.subscribe((seguimientos) => {
    this.seguimientosCliente = seguimientos;
    console.log('seguimientos',this.seguimientosCliente)
  });
}


    },
    error:(error:any)=>{
       console.error("No se encontro el usuario",error)
    }
    
    

})}

buscarSeguimiento() {
  this.busquedaRealizada = true;

  const resultado = this.seguimientosCliente.find(
    (s) => s.codigoSeguimiento === this.codigoBusqueda
  );

  if (resultado) {
    // Opcional: ordenar los estados por fecha si lo necesitás
    resultado.estados.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
  }

  this.seguimientoEncontrado = resultado ?? null;
}


}
