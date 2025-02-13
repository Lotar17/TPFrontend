import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComprasService } from '../api/compra.service';
import { ProductosService } from '../api/producto.service';
import { Compra } from '../../models/compra.entity';
import { error } from 'console';
import { CommonModule } from '@angular/common';
import { item_Compra } from '../../models/compra.entity';
import { CarritoService } from '../api/cart.service';
import { response } from 'express';
import { item } from '../models/item.entity';


@Component({
  selector: 'app-devolucion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './devolucion.component.html',
  styleUrl: './devolucion.component.css'
})
export class DevolucionComponent {
id_compra!:string;
compra!:Compra;
items: item_Compra[]=[];
productDescription!:string;
item!:item_Compra



    constructor(
      private compraService: ComprasService,
      private productoService: ProductosService,
      private route:ActivatedRoute,
     private cartService:CarritoService
    ) {}

    ngOnInit(): void {
      this.loadCompra();
    }
loadCompra(){
this.id_compra=this.route.snapshot.paramMap.get('id') || '';
if(this.id_compra){
this.compraService.getOne(this.id_compra).subscribe({
next:(response:any)=>{



console.log(response.data)


},
error: (error)=> {
  console.error('Error al obtener la comora',error)
}



})

}



}


getProductoDescripcion(item: any): string {
  if (item.producto && item.producto.descripcion) {
    return item.producto.descripcion;
  }
  return ''; // Retorna un valor predeterminado si no tiene descripción
}

realizarDevolucion(){


}


}
