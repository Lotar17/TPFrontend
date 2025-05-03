import { Component } from '@angular/core';
import { CarritoService } from '../api/cart.service';
import { ActivatedRoute, Route, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Item } from '../models/item.entity';
import { ComprasService } from '../api/compra.service';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { AutenticacionService } from '../api/autenticacion.service';
import { HistoricoPrecioService } from '../api/calculaprecio.service';
import { Producto } from '../models/producto.entity';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { HeaderComponent } from "../header/header.component";


@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, SidebarComponent, HeaderComponent,RouterLink],
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
mensajeStock: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private carritoService: CarritoService,
    private compraService: ComprasService,
    private router:Router,
    private cd:ChangeDetectorRef,
    private autenticacionService:AutenticacionService
  ) {}

  ngOnInit() {
    this.autenticacionService.getUserInformation().subscribe({
      next: (response: any) => {
        console.log('Usuario encontrado:', response); // Verifica la respuesta
        if (response && response.data && response.data.id) {
          this.idUser = response.data.id;
          console.log('idUser:', this.idUser); // Asegúrate de que el idUser esté correctamente asignado
  
          // Si el idUser es válido, obtenemos el carrito
          this.carritoService.getCarrito(this.idUser);
          
          // Nos suscribimos al carrito para recibir actualizaciones en tiempo real
          this.carritoService.carritoItems$.subscribe((items) => {
            this.items = items;
            this.subtotal = this.carritoService.calcularSubtotal(this.items);
          });
        } else {
          console.error('No se encontró la información del usuario.');
        }
      },
      error: (error: any) => {
        console.error('Error al obtener la información del usuario', error);
      },
    });
  }
  

    incrementarCantidad(producto: Producto | undefined, item: Item) {
      const idProducto = producto?.id;
      if (!idProducto) return;
    
      if (producto.stock && item.cantidad_producto >= producto.stock) {
        this.mensajeStock = 'No puedes agregar más unidades, alcanzaste el stock disponible.';
        return;
      }
          if (item.id) {
            this.carritoService.IncrementQuantity(item.id, idProducto);
          }
      
    }
    
  decrementarCantidad(idProducto: string | undefined, item: Item) { 
    if (!idProducto) return;
    if (item.cantidad_producto <= 1) {
      console.warn("❌ No puedes reducir más la cantidad.");
      return;
    }

    this.carritoService.DecrementQuantity(idProducto, this.idUser);
  }


  eliminarItem(itemId: string | undefined) {
    if (!itemId) return;
  
    
    this.carritoService.removeItem(itemId);
    this.cd.detectChanges(); // 🔄 Forzamos que Angular detecte los cambios
  }
  confirmarCompra() {
    this.realizarCompra(this.items); 
    this.mostrarResumenCompra = false;
  }

  realizarCompra(items_compra: Item[]): void {
    this.compraService.setItem(items_compra);
    
    const carritoActualizado = this.items.filter(
      item => !items_compra.some(compraItem => compraItem.id === item.id)
    );

    this.carritoService.actualizarCarrito(carritoActualizado); // Que hace esto aca
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