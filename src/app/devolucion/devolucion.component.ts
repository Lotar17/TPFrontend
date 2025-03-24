import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComprasService } from '../api/compra.service';
import { ProductosService } from '../api/producto.service';
import { Compra } from '../models/compra.entity';
import { ItemService } from '../api/item.service';
import { CommonModule } from '@angular/common';
import { Item } from '../models/item.entity';
import { CarritoService } from '../api/cart.service';

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
    constructor(
      private compraService: ComprasService,
      private productoService: ProductosService,
      private route:ActivatedRoute,
     private cartService:CarritoService,
     private historicoPrecioService:HistoricoPrecioService,
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
      
      
      console.log(response.data)
      
      
      },
      error: (error)=> {
        console.error('Error al obtener la comora',error)
      }
      
      
      
      })
      
      }
      
      
      
      }
      RealizarDevolucion(item: Item) {
        this.itemService.setItem(item)
        this.router.navigate(['/solicitud'])
      }
      realizarDevolucion(itemDevuelto: Item) {
        if (!itemDevuelto.producto?.id) {
          console.error("Producto es undefined");
          return;
        }
        if (itemDevuelto.producto?.stock !== undefined) {
          this.stockNuevo = itemDevuelto.cantidad_producto + itemDevuelto.producto.stock;
        } else {
          console.error("Stock del producto es undefined");
          return;
        }
        
        this.productoActualizado = {
          ...itemDevuelto.producto,
          stock: this.stockNuevo
        };
        
        console.log("Actualizando producto completo con:", this.productoActualizado);
        
        if (itemDevuelto.producto.id && this.compra.total_compra) {
          this.productoService.actualizarProducto(itemDevuelto.producto.id, this.productoActualizado)
            .subscribe({
              next: (response: any) => {
                console.log('Producto actualizado:', response.data);
        
             if(itemDevuelto.producto?.id)
                this.historicoPrecioService.getOne(itemDevuelto.producto.id).subscribe({
                  next: (valor: any) => {
                    console.log('Precio histórico obtenido:', valor);
                    if (valor !== undefined) {
                      if(valor !== 0){
                        this.precioActual=valor
                      }
                      else{
                        this.precioActual=0
                      }
                    }
                   this.totalAnterior=this.compra.total_compra?? 0
                   this.subTotal=itemDevuelto.cantidad_producto*this.precioActual
                    this.valorCompra = this.totalAnterior  - this.subTotal
                    
                    console.log('Nuevo total de la compra:', this.valorCompra);
        
                    this.compraActualizada = {
                      id:this.compra.id,
                      direccion_entrega:this.compra.direccion_entrega,
                      persona:this.compra.persona,
                      fecha_hora_compra:this.compra.fecha_hora_compra,

                      total_compra: this.valorCompra
                    };
        
                    console.log("Actualizando total de compra:", this.compraActualizada);
        
                    
                    this.compraService.update(this.compraActualizada).subscribe({
                      next: (response: any) => {
                        console.log('Compra actualizada:', response.data);
        
                     if(itemDevuelto.id)
                       this.cartService.removeItem(itemDevuelto.id)
                      },
                      error: (error) => {
                        console.error(`Error al actualizar el total de compra:`, error);
                      }
                    });
                  },
                  error: (error:any) => {
                    console.error(`Error al obtener el precio histórico:`, error);
                  }
                });
              },
              error: (error) => {
                console.error(`Error al actualizar el producto ${itemDevuelto.producto?.id}:`, error);
              }
            });
        } else {
          console.error("Producto o ID del item no válidos.");
        }
        console.log(this.compra)
        console.log(itemDevuelto)
        

    }}