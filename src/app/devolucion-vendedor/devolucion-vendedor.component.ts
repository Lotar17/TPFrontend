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
  this.solicitudService.getVendedorRequest(this.idVendedor).subscribe({
next:(response:any)=>{
this.solicitudes=response.data

}
 })
 },
 error:(error:any) =>{
  console.error("salmflfd",error)
 }
})}
requestDecission(solicitud:Devolucion, decision: string, item: Item) {
  if(solicitud.id)
  this.solicitudService.makeDecission(solicitud.id, decision).subscribe({
    next: (response: any) => {
      console.log('Solicitud aprobada/rechazada con éxito', response.data);
this.solicitud=solicitud
      if (decision === 'Aprobada') {
        this.item1 = item;
        this.cantidadDevuelta=this.solicitud.cantidad_devuelta
        if (this.item1.producto?.stock !== undefined) {
          this.stockProducto = Number(this.item1.producto.stock) || 0;
  this.cantidadDevuelta = Number(this.cantidadDevuelta) || 0;
 
          this.stockNuevo = this.cantidadDevuelta + this.stockProducto;
          console.log(this.stockNuevo);
        } else {
          console.error("Stock del producto es undefined");
          return;
        }

        this.productoActualizado = {
          ...this.item1.producto,
          stock: this.stockNuevo
        };
console.log("Aca esta el producto actualizado",this.productoActualizado)
        if (this.item1.producto.id) {
          this.productoService.actualizarProducto(this.item1.producto.id, this.productoActualizado).subscribe({
            next: (response: any) => {
              console.log("Producto actualizado", response.data);

              if (this.item1.producto?.id) {
                this.historicoPrecioService.getOne(this.item1.producto.id).subscribe({
                  next: (valor: any) => {
                    console.log('Precio histórico obtenido:', valor);
                    
                    this.totalAnterior = this.item1.compra?.total_compra ?? 0;
                    
                    this.subTotal = this.cantidadDevuelta * valor;
                    this.valorCompra = this.totalAnterior - this.subTotal;
                   
                    if (this.item1.compra) {
                      this.compraActualizada = {
                        id: this.item1.compra.id,
                        direccion_entrega: this.item1.compra.direccion_entrega,
                        persona: this.item1.compra.persona,
                        fecha_hora_compra: this.item1.compra.fecha_hora_compra,
                        total_compra: this.valorCompra
                      };
                    }
                    if(this.item1.compra?.id)
              this.compraService.update(this.compraActualizada).subscribe({
            next:(response)=>{
console.log("La compra se actualizo",response.data)

const compraActual=response.data
console.log('items',compraActual?.items?.length)

this.itemService.update(this.item1,this.cantidadDevuelta).subscribe({
next:(response:any)=>{
  this.item1=response.data

console.log("Item actualizado con exito",response.data)
console.log('compra',this.item1.compra)
if (this.item1.cantidad_producto===0) {
  
  console.log(compraActual)
 
  console.log(this.item1.cantidad_producto)
  if (this.item1.id) {
    console.log('🗑 Eliminando item con ID:', this.item1.id);
    this.itemService.removeItem(this.item1.id).subscribe({
      next: (response: any) => {
        console.log('✅ Item eliminado con éxito', response.data);

        if(compraActual)
        if(compraActual.items?.length===1){
          if(compraActual.id)
this.compraService.delete(compraActual.id).subscribe({
next:(response:any)=>{
console.log('Compra eliminada con exito',response.data)
}, 
  error:(error:any)=>{
    console.error('No se pudo eliminar la compra', error)
  }


})

        }
      },
      error: (error: any) => {
        console.error("❌ No se eliminó el item", error);
      }
    });
  } else {
    console.error("❌ No se puede eliminar el item: ID no definido");
  }
}


}, error:(error:any)=>{
  console.error("No se actualizo el item",error)
}



})


            },
            error:(error:any)=>{
              console.error("La compra no se actualizo",error)
            }
            
            
            
            
            
            
            
            
              })    
                  
                  
                  
              
                  
                  
                  
                  },
                  error: (error: any) => {
                    console.error('Error al obtener el precio histórico', error);
                  }
                });
              }
            },
            error: (error: any) => {
              console.error('Producto no actualizado', error);
            }
          });
        }
      }
    },
    error: (error: any) => {
      console.error('Error en la decisión de la solicitud', error);
    }
  });
}





}



