import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { Producto } from '../../models/producto.entity';
import { RouterLink } from '@angular/router';
import { HistoricoPrecioService } from '../api/calculaprecio.service';
import { CommonModule } from '@angular/common';
import { Response } from 'express';
import { CarritoService } from '../api/cart.service';
import { AuthService } from '../api/Auth.service';
@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink,CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {


  @Input() producto!: Producto;
  precio!: number; 

  constructor(private historicoprecioService: HistoricoPrecioService,
    private carritoService:CarritoService,
    private authService:AuthService
  ) {}

  ngOnInit(): void {
    if (this.producto.id) {
      this.obtenerPrecio(this.producto.id); 
    }
  }

  obtenerPrecio(id: string): void {
    this.historicoprecioService.getOne(id).subscribe(
      (valor:any) => {
        if (valor !== undefined) {
          if(valor !== 0){this.precio = valor;}
          else{this.precio === 0} 
        } else {
          console.log('No se encontró el precio histórico');
        }
      },
      (error) => {
        console.error('Error al obtener el precio:', error);
      }
    );
  }

  agregarAlCarrito(id_Producto: string| undefined) {
    
    const idPersona = this.authService.getUserId();
    const idProducto= id_Producto || ""


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

}
