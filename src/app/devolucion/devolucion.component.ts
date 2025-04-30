import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComprasService } from '../api/compra.service';
import { ProductosService } from '../api/producto.service';
import { Compra } from '../models/compra.entity';
import { ItemService } from '../api/item.service';
import { CommonModule } from '@angular/common';
import { Item } from '../models/item.entity';
import { CarritoService } from '../api/cart.service';
import { SolicitudService } from '../api/solicitud.service';
import { Producto } from '../models/producto.entity';

import { HistoricoPrecioService } from '../api/calculaprecio.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-devolucion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './devolucion.component.html',
  styleUrl: './devolucion.component.css'
})
export class DevolucionComponent {
id_compra!:string;
compra!:Compra
productDescription!:string;
item!:Item
prod!:Producto
stockUpdate!:number
itemDevuelto!:Item
stockNuevo!:number
valorCompra!:number
valorActualCompra!:number
compraActualizada!:Compra
productoActualizado!:Producto
precioActual!:number
totalAnterior!:number
subTotal!:number
mensajeError:string|null=null
    constructor(
      private compraService: ComprasService,
      private solicitudService:SolicitudService,
      private route:ActivatedRoute,
      private router:Router,
      private itemService:ItemService
    ) {}

    ngOnInit(): void {
      this.loadCompra();
    }
    loadCompra(){
      this.id_compra=this.route.snapshot.paramMap.get('id') || '';
      if(this.id_compra){
      this.compraService.getOne(this.id_compra).subscribe({
      next:(response:any)=>{
      this.compra=response.data
      this.compraService.setCompra(this.compra) // Esto aca no va
      
      console.log(response.data)
      
      
      },
      error: (error)=> {
        console.error('Error al obtener la comora',error)
      }
      
      
      
      })
      
      }
      
      
      
      }
      RealizarDevolucion(item: Item) {
        console.log('Estados seguimiento long', item.seguimiento?.estados.length);
      
        if (item.seguimiento?.estados.length !== 4) {
          this.mensajeError = 'No puede devolver ningún producto que aún no haya llegado a su destino';
          return;
        }
      
        if (item.id) {
          this.solicitudService.validaPendientes(item.id).subscribe({
            next: (response: any) => {
              console.log('Respuesta', response.data);
      
              if (response.data === true) { 
                this.itemService.setItem(item);
                this.router.navigate(['/solicitud']);
              } else {
                this.mensajeError = 'No se pudo validar la devolución.';
              }
            },
            error: (error: any) => {
              if (error.status === 400) {
                this.mensajeError = error.error?.message || 'Error de validación de devolución.';
                return;
              }
              console.error('No se pudo realizar validación de item con solicitud pendiente', error);
              this.mensajeError = 'Ocurrió un error inesperado al validar la devolución.';
            }
          });
        }
      }
      
    }