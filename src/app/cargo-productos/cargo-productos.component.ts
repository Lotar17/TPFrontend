import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CRUDService } from '../api/crud.service.js';
import { Producto } from '../models/producto.entity.js';

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
errorStock:string|null=null
errorPrecio:string|null=null
precioInvalido = false;

  publicaForm = new FormGroup({
    descripcion: new FormControl(),
    precio: new FormControl(),
    stock: new FormControl(),
    categoria: new FormControl(),
  });
  constructor(
    private crudService: CRUDService<Producto>,

    private categoriaService: CategoriaService,
    private autenticacionService:AutenticacionService
  ) {
    categoriaService.getAll('categorias');
  }
  
ngOnInit(){
  this.validarStock();
    this.validarPrecio();
}
  
  async onSubmit() {
    let userId = ''
this.cargaExitosa=true
    this.autenticacionService.getUserInformation().subscribe({
      next:(response:any)=>{
userId=response.data.id
if (!userId) {
  console.error('El usuario no está logueado.');
 
  return;
}
const producto: Producto = {
  descripcion: this.publicaForm.value.descripcion,
  stock: this.publicaForm.value.stock,
  precio: this.publicaForm.value.precio,
  categoriaId: this.publicaForm.value.categoria, 
  personaId: userId, 
};
this.crudService.add('productos', producto);
this.mostrarNotificacion('Producto cargado con exito!')
      },
      error:(error:any)=>{
      
        console.error("No se encontro el usuario",error)
      }
      


    })

  
  }
  validarStock() {
    const cantidad = this.publicaForm.value.stock;
    this.cantidadInvalida = cantidad <= 0;
 
  }

  // Validar Precio
  validarPrecio() {
    const precio = this.publicaForm.value.precio;
    this.precioInvalido = precio <= 0;

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
