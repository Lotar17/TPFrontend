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
  mostrarModal = false;
itemSeleccionado!: Item|null ;
modalConfirmacionEliminacion = false;
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
           
            this.subtotal = this.carritoService.calcularSubtotal(this.items);
          });
        }
      },
      error: (error: any) => {
        console.error("No se encontró información del usuario", error);
      }
    });}

  incrementarCantidad(idProducto: string | undefined, item: Item) { // Llamar al metodo incrementQuantity del service
    if (!idProducto) return;
    
let idUser=''
this.autenticacionService.getUserInformation().subscribe({
next:(response:any)=>{
idUser=response.data.id
if(item.id)
this.carritoService.IncrementQuantity(item.id,idProducto);
},
error:(error:any)=>{

  console.error("No se encontro el usuario",error)
}})}
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
  }})}

  eliminarItem(itemId: string | undefined) {
    if (!itemId) return;
  
    
    this.carritoService.removeItem(itemId);
    this.cd.detectChanges(); // 🔄 Forzamos que Angular detecte los cambios
  }
  confirmarCompra() {
   
    this.realizarCompra(this.items); 

    
    this.router.navigate(['/buys']);

    this.mostrarResumenCompra = false;
  }

  realizarCompra(items_compra: Item[]): void {
    this.compraService.setItem(items_compra);
    
    const carritoActualizado = this.items.filter(
      item => !items_compra.some(compraItem => compraItem.id === item.id)
    );

    this.carritoService.actualizarCarrito(carritoActualizado); 
    this.router.navigate(['/buys']);
  }
  mostrarModalDeCompra() {
    this.abrirResumenCompra();
  }
  mostrarResumenCompra = false;
  abrirResumenCompra() {
    this.mostrarResumenCompra = true;
    this.cd.detectChanges();
  }




  confirmarEliminacion(item: Item) {
    this.itemSeleccionado = item;
    this.modalConfirmacionEliminacion = true;
  }
  
  cancelarEliminacion() {
    this.modalConfirmacionEliminacion = false;
    this.itemSeleccionado = null;
  }

  eliminarItemConfirmado() {
    if (this.itemSeleccionado?.id) {
      this.eliminarItem(this.itemSeleccionado.id);
      this.itemSeleccionado = null;
      this.modalConfirmacionEliminacion = false;
      
    }
  }
  
}