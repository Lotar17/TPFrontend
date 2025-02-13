import { Component } from '@angular/core';
import { CarritoService } from '../api/cart.service';
import { ActivatedRoute, Route } from '@angular/router';
import { CommonModule } from '@angular/common';
import { item } from '../models/item.entity';
import { AuthService } from '../api/Auth.service';
import { RouterLink } from '@angular/router';
import { ComprasService } from '../api/compra.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  items: item[] = [];
  constructor(
    private route: ActivatedRoute,
    private carritoService: CarritoService,
    private authService:AuthService,
    private compraService: ComprasService,
    private router:Router
  ) {}

  ngOnInit() {
    const idPersona = this.authService.getUserId()
    if (idPersona) {
      this.carritoService.getCarrito(idPersona).subscribe({
       next: (response:any) => {
            console.log("Respuesta del servidor:", response); 
             this.carritoService.actualizarCarrito(response);
            if (response && response.data) {
                this.items = response.data;
                console.log("Items asignados:", this.items); 
            }
        },
       error: (error) => {
            console.error('Error al obtener el carrito:', error);
        }
    });
    
    }
  }

incrementarCantidad(idProducto:string, item: item){
  const idPersona = this.authService.getUserId();
item.cantidad_producto++;
  this.carritoService.addItemToCarrito(idProducto, idPersona).subscribe({
    next: (response: any) => {  
      if (response) {
        console.log(response.message);
      }
    },
    error: (error) => {  
      console.error('Error:', error);
    }
  });

}
decrementarCantidad(idProducto:string, item:item){
  const idPersona = this.authService.getUserId();
  item.cantidad_producto--;
  this.carritoService.decrementQuantityofItem(idProducto, idPersona).subscribe({
    next: (response: any) => {  
      if (response) {
        console.log(response.message);
      }
    },
    error: (error) => {  
      console.error('Error:', error);
    }
  });



}
eliminarItem(idItem:string|undefined){
  if (!idItem) {
    console.error('Error: idItem es undefined');
    return;
  }
  
  this.carritoService.removeItem(idItem).subscribe({
    next: (response: any) => {  
      if (response) {
        console.log(response.message);
      }
    },
    error: (error) => {  
      console.error('Error:', error);
    }
  });

}
realizarCompra(items_compra: item[]): void {
  this.compraService.setItem(items_compra); // Asegúrate que el nombre coincide
  this.router.navigate(['/buys']);
}
}






