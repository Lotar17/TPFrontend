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
 cantidadAactualizar:number=0
  
mostrarConfirmacion: boolean = false;
mostrarExito: boolean = false;
mensajeExito: string = '';
accionSeleccionada: 'Aprobada' | 'Rechazada' | null = null;
solicitudSeleccionada: Devolucion|null = null;
mostrarModalStock: boolean = false;
cantidadAActualizar: number = 0;
itemSeleccionado: Item|null = null;

mensajeStock: string = '';
tipoMensajeStock: 'exito' | 'error' | '' = '';
stockActualizando: boolean = false;




constructor(
private autenticacionService:AutenticacionService,
private solicitudService:SolicitudService,
private productoService:ProductosService,
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


actualizarStock(item: Item, solicitud: Devolucion) { // Para actualizar stock
  const cantidad_devuelta = solicitud.cantidad_devuelta;
  const cantidadAActualizar = this.cantidadAActualizar;
  console.log('Cantidad a actualizar',cantidadAActualizar)

  this.solicitudService.validoCantidad(cantidad_devuelta, cantidadAActualizar).subscribe({
    next: (res: any) => {
      if (res.data === true) {
        const stockNuevo = cantidadAActualizar + (solicitud.item.producto?.stock || 0);

        this.productoActualizado = {
          ...item.producto,
          stock: stockNuevo
        };

        if (item.producto?.id) {
          this.productoService.actualizarProducto(item.producto.id, this.productoActualizado).subscribe({
            next: (response: any) => {
              this.tipoMensajeStock = 'exito';
              this.mensajeStock = 'Stock actualizado correctamente.';
              this.stockActualizando = true;
              this.mostrarModalStock = false;
              this.mostrarProductoLlego = false;
              this.solicitudSeleccionadaId = null;
            },
            error: (error: any) => {
              if(error.status===400)   this.mensajeStock = error.error?.message || 'Error de validación.';
              this.tipoMensajeStock = 'error';
              this.mensajeStock = 'Error al actualizar el stock.';
              this.mostrarModalStock = false;
            }
          });
        }
      } else {
        this.tipoMensajeStock = 'error';
        this.mensajeStock = 'Cantidad inválida para devolver.';
        this.mostrarModalStock = false;
      }
    },
    error: (error: any) => {
      this.tipoMensajeStock = 'error';
      if (error.status === 400) {
        this.mensajeStock = error.error?.message || 'Error de validación.';
      } else {
        this.mensajeStock = 'Error inesperado en la validación.';
      }
      this.mostrarModalStock = false;
    }
  });
}


cerrarDevolucion(solicitud: Devolucion) {// Cierre 
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

abrirConfirmacion(solicitud: Devolucion, accion: 'Aprobada' | 'Rechazada') { /// Modal de aceptar o rechazar
  this.solicitudSeleccionada = solicitud;
  this.accionSeleccionada = accion;
  this.mostrarConfirmacion = true;
}



confirmarAccion() { // confirmo la solicitud o sea apruebo o rechazo
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

cancelarAccion() { // si cancelo en el caso que apruebe o recha
  this.mostrarConfirmacion = false;
  this.solicitudSeleccionada = null;
  this.accionSeleccionada = null;
}

modalConfirmacionCierreAbierto: boolean = false;
solicitudACerrar!: Devolucion;

abrirConfirmacionCierre(solicitud: Devolucion) {
  if (this.mensajeCierre.trim() === '') {
    // Validación adicional (si el mensaje está vacío)
    alert('Por favor ingresa un mensaje de cierre.');
    return;}
  this.solicitudACerrar = solicitud;
  this.modalConfirmacionCierreAbierto = true;
}

confirmarCierre() { // para el cierre
  this.modalConfirmacionCierreAbierto = false;
  this.cerrarDevolucion(this.solicitudACerrar);
}

abrirModalStock(solicitud:Devolucion){ // Para stock
  this.itemSeleccionado = solicitud.item;
  this.solicitudSeleccionada = solicitud;
  this.cantidadAActualizar = 0; // el usuario lo completa
  this.mostrarModalStock = true;
  this.mensajeStock = '';
  this.tipoMensajeStock = '';

}
confirmarActualizarStock() { // para stock
  if (this.itemSeleccionado && this.solicitudSeleccionada) {
    this.actualizarStock(this.itemSeleccionado, this.solicitudSeleccionada);
  }
}



}


