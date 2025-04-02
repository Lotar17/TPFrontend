import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { Producto } from '../models/producto.entity';
import { RouterLink } from '@angular/router';
import { HistoricoPrecioService } from '../api/calculaprecio.service';
import { CommonModule } from '@angular/common';
import { Response } from 'express';
import { CarritoService } from '../api/cart.service';

import { CurrencyPipe } from '@angular/common';
import localeEs from '@angular/common/locales/es-AR';
import { AutenticacionService } from '../api/autenticacion.service';
@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink, CommonModule, CurrencyPipe],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
})
export class ProductCardComponent {
  @Input() producto!: Producto;
  precio!: number;
  showNotification: boolean = false; // Variable para controlar la visibilidad del cartel
  mensajeNotificacion: string = ''; 

  constructor(
    private historicoprecioService: HistoricoPrecioService,
    private carritoService: CarritoService,
    private autenticacionService:AutenticacionService
  ) {}

  ngOnInit(): void {
    if (this.producto.id) {
      this.obtenerPrecio(this.producto.id);
    }
  }

  obtenerPrecio(id: string): void {
    this.historicoprecioService.getOne(id).subscribe(
      (valor: any) => {
        if (valor !== undefined) {
          if (valor !== 0) {
            this.precio = valor;
          } else {
            this.precio === 0;
          }
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
    
   let userId
    const idProducto= id_Producto || ""
if (!idProducto) return;
this.autenticacionService.getUserInformation().subscribe({
  next:(response:any)=>{
  userId=response.data.id
  this.carritoService.addItemToCarrito(idProducto, userId);
  this.mostrarNotificacion(`${this.producto.descripcion} se agregó al carrito.`);



  },
  error:(error:any)=>{
  
    console.error("No se encontro el usuario",error)
  }




      
    })}
    mostrarNotificacion(mensaje: string) {
      this.mensajeNotificacion = mensaje;
      this.showNotification = true;
  
      // Ocultar el cartel después de 3 segundos
      setTimeout(() => {
        this.showNotification = false;
      }, 3000);
    }
  }


