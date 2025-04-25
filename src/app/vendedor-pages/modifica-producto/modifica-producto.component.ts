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
errorStock:string|null=null
errorPrecio:string|null=null



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
if(this.producto.precio)
  this.precioOriginal=this.producto.precio

  }



guardarCambios(){

  if(this.producto.descripcion!== this.descripcionOriginal){
this. guardaDescripcion()
}
if(this.producto.stock!==this.stockOriginal){
  if(this.producto.stock)
  if(this.producto.stock<0){
this.errorStock='No se puede ingresar una cantidad de stock menor a 0'
return
  }
  else{
    this.cambioConfirmado= true; 
  this.guardaStock()}
}
if(this.producto.precio!== this.precioOriginal){
  console.log('Precio Original',this.precioOriginal)
  if(this.producto.precio)
  if(this.producto.precio<0){
this.errorPrecio='No puede ingresar un precio de producto negativo'
  }
  else{
    this.cambioConfirmado=true
this.guardaPrecio()

}

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
this.descripcionOriginal=this.producto.descripcion ?? ''
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
    this.stockOriginal=this.producto.stock ?? 0
      },
      error:(error:any)=>{
      
        console.error("No se pudo actualizar el producto",error)
      }
})}
guardaPrecio(){
  console.log(this.producto.id)
  if(this.producto.id && this.producto.precio)
  this.historicoPrecioService.createPrecio(this.producto.precio,this.producto.id).subscribe({

    next:(response)=>{
console.log('Precio creado con exito',response.data)
this.precioOriginal = this.producto.precio ?? 0
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
     
    }
    cerrarModalConfirmacion() { // si la compra no se acepta en el modal
      this.confirmaCambio = false;
    }
    cerrarModalDetalle() {
      this.cambioConfirmado = false;
      
    }
}











