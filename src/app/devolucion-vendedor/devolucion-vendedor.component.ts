import { Component } from '@angular/core';
import { SolicitudService } from '../api/solicitud.service';
import { Devolucion } from '../models/solicitudDevolucion.entity';
import { AutenticacionService } from '../api/autenticacion.service';
import { ItemService } from '../api/item.service';
import { error } from 'console';
import { CommonModule } from '@angular/common';
import { Item } from '../models/item.entity';
import { Compra } from '../models/compra.entity';
import { Producto } from '../models/producto.entity';
import { ProductosService } from '../api/producto.service';
import { HistoricoPrecioService } from '../api/calculaprecio.service';
import { ComprasService } from '../api/compra.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { switchMap,tap,map,of,pipe,filter,every } from 'rxjs';
import { CorreoService } from '../api/correo.service';
@Component({
  selector: 'app-devolucion-vendedor',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './devolucion-vendedor.component.html',
  styleUrl: './devolucion-vendedor.component.css'
})
export class DevolucionVendedorComponent {
idVendedor!:string

idSolicitud!:string;
estadoSolicitud!:string;
item1!:Item
stockNuevo!:number;
productoActualizado!:Producto
compra!:Compra
stockProducto!:number
precioActual!:number
totalAnterior!:number
valorCompra!:number
compraActualizada!:Compra
subTotal!:number
cantidadDevuelta!:number
solicitud!:Devolucion
compraUpdate!:Compra
mostrarProductoLlego: boolean = false; // Controla visibilidad de "Llegó el producto"
  solicitudSeleccionadaId: string | null = null; // Almacena el ID de la solicitud activa
  mostrarCierre: boolean = false; // Controla visibilidad del formulario de cierre
  mensajeCierre: string = ''; // Almacena el mensaje de cierre
  filtroCliente: string = '';
  filtroProducto: string = '';
  solicitudesOriginal: Devolucion[] = [];
  solicitudes: Devolucion[] = [];

  
mostrarConfirmacion: boolean = false;
mostrarExito: boolean = false;
mensajeExito: string = '';
accionSeleccionada: 'Aprobada' | 'Rechazada' | null = null;
solicitudSeleccionada: Devolucion|null = null;



constructor(
private autenticacionService:AutenticacionService,
private solicitudService:SolicitudService,
private productoService:ProductosService,
private historicoPrecioService:HistoricoPrecioService,
private compraService:ComprasService,
private itemService:ItemService,
private correoService:CorreoService
){}

ngOnInit(){
this.autenticacionService.getUserInformation().subscribe({
 next:(response:any)=>{
this.idVendedor=response.data.id

if(this.idVendedor)
 this.solicitudService.getSolicitudesVendedor(this.idVendedor);
this.solicitudService.solicitudesVendedor$.subscribe({
next:(solicitudes:any)=>{
this.solicitudesOriginal=solicitudes
this.filtrarSolicitudes();
},
error:(error:any)=>{
  console.error('No se devolvieron solicitudes',error)
}





})
 },
 error:(error:any) =>{
  console.error("salmflfd",error)
 }
})}
requestDecision(solicitud: Devolucion, decision: string, item: Item) {
  if (!solicitud.id || !item.producto?.id || !item.compra?.id) return;

  const idProducto = item.producto.id;
  const cantidadDevuelta = solicitud.cantidad_devuelta ?? 0;

  if (decision === 'Aprobada') {
    solicitud.estado = 'Aprobada';
    this.solicitudService.Decission(solicitud.id, decision).pipe(
      switchMap(() =>
        this.solicitudService.updateCompraBydevolution(item, cantidadDevuelta)
      ),
      switchMap(() =>
        this.itemService.update(item, cantidadDevuelta)
      ),
      switchMap(() => {
        const destinatario = solicitud.comprador?.mail || '';
        const asunto = 'Devolución aprobada ✅';
        const mensaje = `Tu solicitud de devolución fue *aprobada*. Se descontó un total de $${(item.precioUnitario! * cantidadDevuelta).toFixed(2)} de la compra del producto: ${item.producto?.descripcion}.`;
        return this.correoService.sendEmail(destinatario, asunto, mensaje);
      }),
      tap(() => console.log('Devolución aprobada: todo procesado y mail enviado.'))
    ).subscribe({
      error: err => console.error("Error en el proceso de devolución", err)
    });

  } else if (decision === 'Rechazada') {
    solicitud.estado = 'Rechazada';
    this.solicitudService.Decission(solicitud.id, decision).pipe(
      switchMap(() => {
        const destinatario = solicitud.comprador?.mail || '';
        const asunto = 'Devolución rechazada ❌';
        const mensaje = `Tu solicitud de devolución fue *rechazada*. Para más detalles podés revisar el panel de devoluciones.`;
        return this.correoService.sendEmail(destinatario, asunto, mensaje);
      }),
      tap(() => console.log('Devolución rechazada: mail enviado.'))
    ).subscribe({
      error: err => console.error("Error en rechazo de devolución o en el envío de mail", err)
    });
  }
}


actualizarStock(item:Item,solicitud:Devolucion) {

 
 const cantidad_devuelta= solicitud.cantidad_devuelta
 let stockNuevo
 if(solicitud.item.producto?.stock)
 stockNuevo= cantidad_devuelta+solicitud.item.producto?.stock

 this.productoActualizado = {
  ...item.producto,
  stock: this.stockNuevo
};
if(item.producto?.id)
this.productoService.actualizarProducto(item.producto?.id,this.productoActualizado).subscribe({
  next:(response:any)=>{
console.log('Stock actualizado con exito ',response.data)
  },
  error:(error:any)=>{
  
    console.error("No se actualizo el stock",error)
  }
  


})


  this.mostrarProductoLlego = false;
  this.solicitudSeleccionadaId = null;
}
cerrarDevolucion(solicitud: Devolucion) {
  this.mostrarCierre = false;
  this.mostrarProductoLlego = false;

  this.solicitudService.cerrarDevolucion(solicitud, this.mensajeCierre)
    .subscribe({
      next: () => {
        console.log(" Devolución cerrada correctamente.");
      },
      error: (err) => {
        alert(err.message || "Ocurrió un error al cerrar la devolución.");
        console.error(" Error:", err);
      }
    });
}


filtrarSolicitudes() {
  this.solicitudes = this.solicitudesOriginal.filter((s) => {
    const cliente = s.item?.persona?.apellido?.toLowerCase() || '';
    const producto = s.item?.producto?.descripcion?.toLowerCase() || '';
    return (
      cliente.includes(this.filtroCliente.toLowerCase()) &&
      producto.includes(this.filtroProducto.toLowerCase())
    );
  });
}

abrirConfirmacion(solicitud: Devolucion, accion: 'Aprobada' | 'Rechazada') {
  this.solicitudSeleccionada = solicitud;
  this.accionSeleccionada = accion;
  this.mostrarConfirmacion = true;
}



confirmarAccion() {
  if (this.solicitudSeleccionada && this.accionSeleccionada) {
    this.requestDecision(this.solicitudSeleccionada, this.accionSeleccionada, this.solicitudSeleccionada.item);
    this.mostrarConfirmacion = false;
    this.mensajeExito = `Solicitud ${this.accionSeleccionada === 'Aprobada' ? 'aprobada' : 'rechazada'} con éxito.`;
    this.mostrarExito = true;

    setTimeout(() => {
      this.mostrarExito = false;
    }, 3000);
  }
}

cancelarAccion() {
  this.mostrarConfirmacion = false;
  this.solicitudSeleccionada = null;
  this.accionSeleccionada = null;
}

modalConfirmacionCierreAbierto: boolean = false;
solicitudACerrar!: Devolucion;

abrirConfirmacionCierre(solicitud: Devolucion) {
  this.solicitudACerrar = solicitud;
  this.modalConfirmacionCierreAbierto = true;
}

confirmarCierre() {
  this.modalConfirmacionCierreAbierto = false;
  this.cerrarDevolucion(this.solicitudACerrar);
}
}


