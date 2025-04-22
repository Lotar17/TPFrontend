import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ProductosService } from '../../api/producto.service';
import { ActivatedRoute } from '@angular/router';
import { Producto } from '../../models/producto.entity';
import { FormsModule } from '@angular/forms';
import { HistoricoPrecioService } from '../../api/calculaprecio.service';


@Component({
  selector: 'app-modifica-producto',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './modifica-producto.component.html',
  styleUrl: './modifica-producto.component.css'
})
export class ModificaProductoComponent {
  idProducto!:string
  producto!:Producto
  editandoDescripcion = false;
  editandoPrecio = false;
  editandoStock = false;
  editandoCategoria = false;
  productoOriginal!:Producto
  precioOriginal!:number
descripcionOriginal!:string
stockOriginal!:number
cambioConfirmado= false
confirmaCambio=false



constructor(private productoService:ProductosService,
  private route: ActivatedRoute,
  private historicoPrecioService:HistoricoPrecioService
)
{}

ngOnInit() {
  this.producto=this.productoService.getProducto()
  if(this.producto.descripcion)
this.descripcionOriginal=this.producto.descripcion
if(this.producto.stock)
this.stockOriginal=this.producto.stock

  }



guardarCambios(){

  if(this.producto.descripcion!== this.descripcionOriginal){
this. guardaDescripcion()
}
if(this.producto.stock!==this.stockOriginal){
  this.guardaStock()
}
if(this.producto.precio!== this.precioOriginal){
this.guardaPrecio()
}

}
guardaDescripcion(){
console.log('se ejecuta',this.producto)
  const productoActualizado={
... this.producto,

}
console.log('aokfksad',productoActualizado)
if(this.producto.id)
this.productoService.actualizarProducto(this.producto.id,productoActualizado).subscribe({
  next:(response:any)=>{
console.log('Producto Actualizado con exito',response.data)
  },
  error:(error:any)=>{
  
    console.error("No se pudo actualizar el producto",error)
  }
  
  



})


}
guardaStock(){
  const productoActualizado={
    ... this.producto,
    
    }
    console.log('aokfksad',productoActualizado)
    if(this.producto.id)
    this.productoService.actualizarProducto(this.producto.id,productoActualizado).subscribe({
      next:(response:any)=>{
    console.log('Producto Actualizado con exito',response.data)
      },
      error:(error:any)=>{
      
        console.error("No se pudo actualizar el producto",error)
      }
})}
guardaPrecio(){
  if(this.producto.id && this.producto.precio)
  this.historicoPrecioService.createPrecio(this.producto.precio,this.producto.id).subscribe({

    next:(response:any)=>{
console.log('Precio creado con exito',response.data)
    },
    error:(error:any)=>{
    
      console.error("No se pudo crear el precio",error)
    }
     })}

     confirmarCambio() { // muestra el modal de confirmacion
      this.confirmaCambio = true;// me activa el metodo realizar cambio
    }
    realizarCambio() { // muestro cuando se acepta en el modal
      this.cerrarModalConfirmacion(); // opcional, si querés cerrar antes
      this.guardarCambios();
      this.cambioConfirmado= true; 
    }
    cerrarModalConfirmacion() { // si la compra no se acepta en el modal
      this.confirmaCambio = false;
    }
    cerrarModalDetalle() {
      this.cambioConfirmado = false;
      
    }
}











