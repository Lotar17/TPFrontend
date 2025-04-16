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
      this.compraService.setCompra(this.compra)
      
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
    }