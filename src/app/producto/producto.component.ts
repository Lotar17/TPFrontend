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
import { SidebarComponent } from "../sidebar/sidebar.component";
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
    SidebarComponent
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
    this.autenticacionService.getUserInformation().subscribe({
      next: (userResponse: any) => {
        console.log('User Response', userResponse);
        if (userResponse?.data) {
          this.idUser = userResponse.data.id;
          this.loadProductos('');
        } else {
          console.error('No se encontró información del usuario');
        }
      },
      error: (error) => {
        console.error('Error al obtener la información del usuario', error);
      }
    });
  }
  

  
  loadProductos(searchTerm: string): void {
    if (!this.idUser) {
      console.error('No hay idUser cargado');
      return;
    }
  
    this.crudService.getByDescripcion('productos', searchTerm, this.idUser).subscribe({
      next: (response: any) => {
        if (response && Array.isArray(response.data)) {
          this.productos = response.data;
        } else {
          this.productos = [];
        }
      },
      error: (error) => {
        console.error("Error al obtener productos", error);
      }
    });
  }

  updateSearchTerm(searchTerm: string) {
    this.searchTerm = searchTerm;
    this.loadProductos(searchTerm);
  }
  verCarrito() {

this.router.navigate(['/carrito', this.idUser])
 }

    
  }

