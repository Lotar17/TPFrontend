import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { Producto } from '../../models/producto.entity';
import { ProductosService } from '../api/producto.service';
import { OnInit } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiResponse } from '../../models/ApiResponse';
import { CommonModule } from '@angular/common';
import { AddCompraComponent } from '../add-compra/add-compra.component';
import { RouterLink } from '@angular/router';




@Component({
  selector: 'app-producto-detalle',
  standalone: true,
  imports: [CommonModule, AddCompraComponent,RouterLink,RouterOutlet],
  templateUrl: './producto-detalle.component.html',
  styleUrls: ['./producto-detalle.component.css']
})
export class ProductoDetalleComponent implements OnInit {
  producto!: Producto; // Variable para almacenar el producto
  error!: string; // Variable para almacenar mensajes de error


  constructor(
    private route: ActivatedRoute, // Para obtener el id de la URL
    private productosService: ProductosService // Servicio para obtener los productos
  ) {}


  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id'); // Obtiene el id de la URL
    if (id) {
      this.getOne(id); // Convierte el id a número y llama al método para obtener el producto
    }
  }


  getOne(id: string): void { // Cambia el tipo de id a string
    this.productosService.getOne(id).subscribe(
      (producto: Producto) => { // Espera un Producto
        this.producto = producto; // Asigna el producto recuperado
      },
      (error: HttpErrorResponse) => {
        this.error = 'Error al cargar el producto'; // Manejo de errores
        console.error('Error fetching product:', error);
      }
    );
  }


 
}
