import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { Producto } from '../models/producto.entity';
import { RouterLink } from '@angular/router';
import { HistoricoPrecioService } from '../api/calculaprecio.service';
import { CommonModule } from '@angular/common';
import { Response } from 'express';
import { CarritoService } from '../api/cart.service';
import { ItemService } from '../api/item.service';

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
  showNotification: boolean = false; 
  mensajeNotificacion: string = ''; 
idProducto!:string
mensajeStock: string | null = null;

  constructor(
    private historicoprecioService: HistoricoPrecioService,
    private carritoService: CarritoService,
    private autenticacionService:AutenticacionService,
    private itemService:ItemService
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

  agregarAlCarrito(producto: Producto) {
    
  
    this.carritoService.manejarItemCarrito(producto, (msg: string) => {
      this.mensajeStock = msg;
      setTimeout(() => this.mensajeStock = null, 3000); 
    });
  }
  
    
  mostrarNotificacion(mensaje: string) {
      this.mensajeNotificacion = mensaje;
      this.showNotification = true;
  
     
      setTimeout(() => {
        this.showNotification = false;
      }, 3000);
    }
  }


