import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CRUDService } from '../api/crud.service.js';
import { Producto } from '../models/producto.entity.js';
import { AuthService } from '../api/Auth.service.js';
import { CategoriaService } from '../api/categoria.service.js';
import { AsyncPipe, CommonModule } from '@angular/common';
import { AutenticacionService } from '../api/autenticacion.service.js';

@Component({
  selector: 'app-cargo-productos',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe,CommonModule],
  templateUrl: './cargo-productos.component.html',
  styleUrl: './cargo-productos.component.css',
})
export class CargoProductosComponent {
  categorias$ = this.categoriaService.$;
  cantidadInvalida: boolean = false;
  cargaExitosa:boolean=false
  mensajeVisible!:string

  publicaForm = new FormGroup({
    descripcion: new FormControl(),
    precio: new FormControl(),
    stock: new FormControl(),
    categoria: new FormControl(),
  });
  constructor(
    private crudService: CRUDService<Producto>,
    private authService: AuthService, // Inyectar AuthService
    private categoriaService: CategoriaService,
    private autenticacionService:AutenticacionService
  ) {
    categoriaService.getAll('categorias');
  }
  async onSubmit() {
    let userId = ''
this.cargaExitosa=true
    this.autenticacionService.getUserInformation().subscribe({
      next:(response:any)=>{
userId=response.data.id
if (!userId) {
  console.error('El usuario no está logueado.');
  // Manejar la situación de que el usuario no está logueado
  return;
}
const producto: Producto = {
  descripcion: this.publicaForm.value.descripcion,
  stock: this.publicaForm.value.stock,
  precio: this.publicaForm.value.precio,
  categoriaId: this.publicaForm.value.categoria, // Nombre de la categoría
  personaId: userId, // ID de la persona logueada
};
this.crudService.add('productos', producto);
      },
      error:(error:any)=>{
      
        console.error("No se encontro el usuario",error)
      }
      


    })

  
  }
  validarStock(){
    const cantidad = this.publicaForm.value.stock;
    
    this.cantidadInvalida = cantidad <= 0 ;
  }
  validarPrecio(){

  }
  mostrarNotificacion(mensaje: string) {
    this.mensajeVisible = mensaje;
    this.cargaExitosa= true;

    // Ocultar el cartel después de 3 segundos
    setTimeout(() => {
      this.cargaExitosa = false;
   
    }, 3000);
  }

}
