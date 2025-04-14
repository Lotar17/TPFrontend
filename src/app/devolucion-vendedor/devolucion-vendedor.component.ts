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
import { Pipe } from '@angular/core';
@Component({
  selector: 'app-devolucion-vendedor',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './devolucion-vendedor.component.html',
  styleUrl: './devolucion-vendedor.component.css'
})
export class DevolucionVendedorComponent {
idVendedor!:string
solicitudes:Devolucion[]=[];
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

  // Métodos existentes''

constructor(
private autenticacionService:AutenticacionService,
private solicitudService:SolicitudService,
private productoService:ProductosService,
private historicoPrecioService:HistoricoPrecioService,
private compraService:ComprasService,
private itemService:ItemService
){}

ngOnInit(){
this.autenticacionService.getUserInformation().subscribe({
 next:(response:any)=>{
this.idVendedor=response.data.id

if(this.idVendedor)
 this.solicitudService.getSolicitudesVendedor(this.idVendedor);
this.solicitudService.solicitudesVendedor$.subscribe({
next:(solicitudes:any)=>{
this.solicitudes=solicitudes
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
requestDecission(solicitud: Devolucion, decision: string, item: Item) {
  if (!solicitud.id || !item.producto?.id || !item.compra?.id) return;

  this.solicitud = solicitud;
  this.item1 = item;
  this.cantidadDevuelta = this.solicitud.cantidad_devuelta ?? 0;
  const idProducto = this.item1.producto?.id;
  if (!idProducto) {
    console.error("ID del producto no definido");
    return;
  }
  if (decision === 'Aprobada') {
    this.solicitudService.Decission(solicitud.id, decision).pipe(
      
      switchMap(() => this.historicoPrecioService.getOne(idProducto)),
      filter((valor:any): valor is number => valor !== undefined), // <--- ACA el cambio importante
      map((valor: number) => {
        this.totalAnterior = this.item1.compra?.total_compra ?? 0;
        this.subTotal = this.cantidadDevuelta * valor;
        this.valorCompra = this.totalAnterior - this.subTotal;
    
        if (this.item1.compra) {
          this.compraActualizada = {
            id: this.item1.compra.id,
            direccionId: this.item1.compra.direccionId,
            persona: this.item1.compra.persona,
            fecha_hora_compra: this.item1.compra.fecha_hora_compra,
            total_compra: this.valorCompra
          };
        }
        return this.compraActualizada;
      }),
      switchMap(compra => this.compraService.update(compra)),
      map(response => response.data),
      switchMap(compraActual => {
        if(compraActual)
        this.compra = compraActual;
        return this.itemService.update(this.item1, this.cantidadDevuelta);
      }),
      map(response => response.data),
      tap(itemActualizado => {
        if(itemActualizado)
        this.item1 = itemActualizado;
    
      
        
      })
    ).subscribe({
      next: () => console.log("Proceso completo ✅"),
      error: err => console.error("Error en el proceso de devolución", err)
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
  console.log('Entro')
  if (!this.mensajeCierre.trim()) {
    alert('Por favor, ingresa un mensaje de cierre.');
   return;
  }
  solicitud.estado='Cerrado'

  const fechaCierre: string = new Date().toISOString();
  const estado = "Cerrado";

  if (solicitud.id) {
    this.solicitudService.updateDevolucion(solicitud.id, estado, fechaCierre, this.mensajeCierre)
      .subscribe({
        next: () => {
          console.log("✅ Devolución cerrada correctamente.");
        },
        error: (err) => {
          console.error("❌ Error al cerrar la devolución:", err);
        }
      });
  }
}


}


