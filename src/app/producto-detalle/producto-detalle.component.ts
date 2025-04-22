import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { Producto } from '../models/producto.entity';
import { ProductosService } from '../api/producto.service';
import { OnInit } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiResponse } from '../../models/ApiResponse';
import { CommonModule } from '@angular/common';
import { AddCompraComponent } from '../add-compra/add-compra.component';
import { RouterLink } from '@angular/router';
import { HistoricoPrecioService } from '../api/calculaprecio.service';
import { CRUDService } from '../api/crud.service';
import { AutenticacionService } from '../api/autenticacion.service';
import { CarritoService } from '../api/cart.service';
import e, { response } from 'express';


@Component({
  selector: 'app-producto-detalle',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './producto-detalle.component.html',
  styleUrls: ['./producto-detalle.component.css']
})
export class ProductoDetalleComponent implements OnInit {
  producto!: Producto;
  error!: string; 
  precio!: number;
 idUsuario!:string
 showNotification: boolean = false; // Variable para controlar la visibilidad del cartel
 mensajeNotificacion: string = ''; 


  constructor(
    private route: ActivatedRoute, 
    private productosService: ProductosService,
    private historicoprecioService: HistoricoPrecioService,
    private crudService: CRUDService<Producto>, 
    private autenticacionService:AutenticacionService,
    private carritoService:CarritoService
  ) {}


  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id'); 
    if (id) {
      this.getOne(id);
      this.calcularPrecio(id) 

      
    }
  }
// aca calcular el precio para el producto

  getOne(id: string): void { 
    this.productosService.getOne(id).subscribe(
      (producto: any) => { // Espera un Producto
        this.producto = producto; // Asigna el producto recuperado
        console.log('Producto recuperado',this.producto)
      },
      (error) => {
        this.error = 'Error al cargar el producto'; 
        console.error('Error fetching product:', error);
      }
    );
    
  }
  calcularPrecio(id: string): void {
    this.historicoprecioService.getOne(id).subscribe(
      (valor:any) => {
        if (valor !== undefined) {
          if(valor !== 0){
            this.precio=valor
          }
          else{
            this.precio=0
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
    
    if(id_Producto)
  this.carritoService.manejarItemCarrito(id_Producto)

     }

  mostrarNotificacion(mensaje: string) {
    this.mensajeNotificacion = mensaje;
    this.showNotification = true;

    // Ocultar el cartel después de 3 segundos
    setTimeout(() => {
      this.showNotification = false;
    }, 3000);
  }

  

 
}
