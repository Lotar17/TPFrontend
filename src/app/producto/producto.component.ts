import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CRUDService } from '../api/crud.service';
import { Producto } from '../models/producto.entity';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { ProductCardComponent } from '../product-card/product-card.component';
import { CargoProductosComponent } from '../cargo-productos/cargo-productos.component.js';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { AutenticacionService } from '../api/autenticacion.service';
import { HeaderComponent } from '../header/header.component.js';
import { response } from 'express';
import { error } from 'console';
@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [
    CommonModule,
    SearchBarComponent,
    ProductCardComponent,
    CargoProductosComponent,
    HeaderComponent,
    RouterLink,
  ],
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css'],
})
export class ProductosComponent {
  productos: Producto[] = [];
  searchTerm: string = '';
idUser!:string
  constructor(
    private crudService: CRUDService<Producto>,
    private router: Router,
    private autenticacionService:AutenticacionService
  ) {}

  ngOnInit(): void {
    this.loadProductos('');
  }

  
loadProductos(searchTerm: string): void {
  this.autenticacionService.getUserInformation().subscribe({
    next: (userResponse: any) => {
      const idUser = userResponse.data.id; 

      this.crudService.getByDescripcion('productos', searchTerm).subscribe({
        next: (response: any) => {
          if (response && Array.isArray(response.data)) {
            
            this.productos = response.data.filter(
              (producto:any) => producto.persona.id !== idUser
            );
          } else {
            this.productos = [];
          }
        },
        error: (error) => {
          console.error("Error al obtener productos", error);
        }
      });
    },
    error: (error) => {
      console.error("Error al obtener la información del usuario", error);
    }
  });
}

  updateSearchTerm(searchTerm: string) {
    this.searchTerm = searchTerm;
    this.loadProductos(searchTerm);
  }
  verCarrito() {
    this.autenticacionService.getUserInformation().subscribe({
next:(response:any)=>{

this.idUser=response.data.id
this.router.navigate(['/carrito', this.idUser])

},
error:(error)=>{
  console.error('Usuario no encontrado',error)
}

    })

    
  }
}
