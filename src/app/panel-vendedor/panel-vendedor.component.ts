import { Component } from '@angular/core';
import { HistoricoPrecioService } from '../api/calculaprecio.service';
import { PersonaService } from '../api/per.service';
import { Persona } from '../models/persona.entity';
import { Producto } from '../models/producto.entity';
import { CRUDService } from '../api/crud.service';
import { CommonModule } from '@angular/common';
import { AutenticacionService } from '../api/autenticacion.service';
import { RouterLink } from '@angular/router';
import { ProductosService } from '../api/producto.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from "../header/header.component";
@Component({
  selector: 'app-panel-vendedor',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, HeaderComponent],
  templateUrl: './panel-vendedor.component.html',
  styleUrl: './panel-vendedor.component.css'
})
export class PanelVendedorComponent {
productos?:Producto[]=[]
idUser!:string
user!:Persona
deleteConfirmado= false// muestra el exito
confirmadelete=false// uso de bandera
filtroDescripcion: string = '';
productosFiltrados: Producto[] = [];
constructor(
  private autenticacionService: AutenticacionService,
  private personaService: PersonaService,
  private historicoPrecioService:HistoricoPrecioService,
  private productoService:ProductosService,
  private route:Router
) {}

ngOnInit() {
  this.autenticacionService.getUserInformation().subscribe({
    next: (response: any) => {
      if (response.data) {
        this.idUser = response.data.id; 
        console.log('ID del usuario:', this.idUser);

        
        this.personaService.getOne(this.idUser).subscribe({
          next: (response: any) => {
            this.user = response.data;
            this.productos = this.user ? this.user.prods_publicados : [];
            if(this.productos)
            this.productosFiltrados = this.productos;
            console.log('Usuario:', this.user);
            this.productos?.forEach((producto)=>{
if(producto.id){

this.historicoPrecioService.getOne(producto.id).subscribe({
  next:(precioActual:any)=>{
producto.precio=precioActual
  },
  error:(error:any)=>{
  
    console.error("No se encontro el precio",error)
  }
  
})}} )},
          error: (error) => {
            console.error('Error al obtener la compra:', error);
          },
        });
      } else {
        console.error('No se pudo obtener la información del usuario.');
      }
    },
    error: (error) => {
      console.error('Error al obtener la información de autenticación:', error);
    },
  });
}
modificarProducto(producto:Producto){
this.productoService.setProducto(producto)
this.route.navigate(['/modificaProducto'])

}
borrarProducto(producto: Producto) {
  if (producto.id) {
    this.productoService.deleteProducto(producto.id).subscribe({
      next: () => {
        console.log(`Producto ${producto.id} eliminado y lista actualizada`);
if(this.productos)
        
        this.productos = this.productos.filter(p => p.id !== producto.id);
        if(this.productos)
        
        this.productosFiltrados = this.productos.filter(p =>
          p.descripcion?.toLowerCase().includes(this.filtroDescripcion.toLowerCase())
        );
      },
      error: (error) => console.error('Error al eliminar producto:', error),
    });
  }
}

confirmarDelete() { // muestra el modal de confirmacion
  this.confirmadelete = true;// me activa el metodo realizar cambio
}
realizarDelete(producto:Producto) { // muestro cuando se acepta en el modal
  this.borrarProducto(producto)
  this.cerrarModalConfirmacion(); // opcional, si querés cerrar antes

  this.deleteConfirmado= true; 
}
cerrarModalConfirmacion() { // si la compra no se acepta en el modal
  this.confirmadelete = false;
}
cerrarModalDetalle() {
  this.deleteConfirmado = false;
  
}
filtrarProductos(): void {
  const filtro = this.filtroDescripcion.toLowerCase();
  if(this.productos)
  this.productosFiltrados = this.productos.filter(p =>
    p.descripcion?.toLowerCase().includes(filtro)
  );
}

}
