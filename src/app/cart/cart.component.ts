import { Component } from '@angular/core';
import { CarritoService } from '../api/cart.service';
import { ActivatedRoute, Route } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Item } from '../models/item.entity';
import { AuthService } from '../api/Auth.service';
import { RouterLink } from '@angular/router';
import { ComprasService } from '../api/compra.service';
import { Router } from '@angular/router';
import { HistoricoPrecio } from '../models/historicoprecio.entity';
import { ChangeDetectorRef } from '@angular/core';
import { AutenticacionService } from '../api/autenticacion.service';
import { response } from 'express';
import { error } from 'console';
import { HistoricoPrecioService } from '../api/calculaprecio.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  items: Item[] = [];
  subtotal!:number;
  showNotification: boolean = false; // Variable para controlar la visibilidad del cartel
  mensajeNotificacion: string = ''; 
  idUser!:string
  idCliente!:string
  constructor(
    private route: ActivatedRoute,
    private carritoService: CarritoService,
   private historicoPrecioService:HistoricoPrecioService,
    private compraService: ComprasService,
    private router:Router,
    private cd:ChangeDetectorRef,
    private autenticacionService:AutenticacionService
  ) {}

  ngOnInit() {
    this.autenticacionService.getUserInformation().subscribe({
      next: (response: any) => {
        this.idUser = response.data.id;
    
        if (this.idUser) {
          this.carritoService.getCarrito(this.idUser);
          
          // Nos suscribimos al carrito para recibir actualizaciones en tiempo real
          this.carritoService.carritoItems$.subscribe((items) => {
            this.items = items;
            this.obtenerPreciosHistoricos();
            this.calcularSubtotal();
          });
        }
      },
      error: (error: any) => {
        console.error("No se encontró información del usuario", error);
      }
    });
    




}

  incrementarCantidad(idProducto: string | undefined, item: Item) {
    if (!idProducto) return;
    if(item.producto?.stock)
    if (item.cantidad_producto >= item.producto.stock) {
      console.warn("❌ No puedes agregar más productos. Stock insuficiente.");
      return;
    }
  
let idUser=''
this.autenticacionService.getUserInformation().subscribe({
next:(response:any)=>{
idUser=response.data.id
this.carritoService.addItemToCarrito(idProducto, idUser);
},
error:(error:any)=>{

  console.error("No se encontro el usuario",error)
}

})
}
  decrementarCantidad(idProducto: string | undefined, item: Item) {
    if (!idProducto) return;
    if (item.cantidad_producto <= 1) {
      console.warn("❌ No puedes reducir más la cantidad.");
      return;
    }
let userId
this.autenticacionService.getUserInformation().subscribe({
  next:(response:any)=>{
  userId=response.data.id
    this.carritoService.DecrementQuantity(idProducto, userId);
  },
  error:(error:any)=>{
  
    console.error("No se encontro el usuario",error)
  }
  
   })}
  eliminarItem(itemId: string | undefined) {
    if (!itemId) return;
  
    
    this.carritoService.removeItem(itemId);
    this.cd.detectChanges(); // 🔄 Forzamos que Angular detecte los cambios
  }
  

  realizarCompra(items_compra: Item[]): void {
    this.compraService.setItem(items_compra);
    
    const carritoActualizado = this.items.filter(
      item => !items_compra.some(compraItem => compraItem.id === item.id)
    );

    this.carritoService.actualizarCarrito(carritoActualizado); // 🚀 Actualizar el estado del carrito
    this.router.navigate(['/buys']);
  }

  calcularSubtotal() {
    this.subtotal = this.items.reduce((total, item) => {
      if (!item.producto || !item.producto.hist_precios) return total;

      const preciosConFecha = item.producto.hist_precios.filter((p: any) => p.fechaDesde);
      const preciosOrdenados = [...preciosConFecha].sort((a: any, b: any) =>
        new Date(b.fechaDesde ?? 0).getTime() - new Date(a.fechaDesde ?? 0).getTime()
      );

      const precioActual = preciosOrdenados.length > 0 ? preciosOrdenados[0].valor : 0;
      return total + precioActual * item.cantidad_producto;
    }, 0);
  }

  obtenerPreciosHistoricos() {
    this.items.forEach((item) => {
      if (item.producto?.id) {
        this.historicoPrecioService.getOne(item.producto.id).subscribe({
          next: (precioData: any) => {
            if(item.producto)
              
            item.producto.precio = precioData; 
            this.cd.detectChanges();
            console.log('Precio',item.producto?.precio)
          },
          error: (error: any) => {
            if(item.producto)
            console.error(`Error obteniendo precio para producto ${item.producto.id}`, error);
          }
        });
      }
    });
  }
  

}