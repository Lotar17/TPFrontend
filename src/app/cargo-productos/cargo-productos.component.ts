import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CRUDService } from '../api/crud.service.js';
import { Producto } from '../models/producto.entity.js';
import { Validators } from '@angular/forms';
import { CategoriaService } from '../api/categoria.service.js';
import { AsyncPipe, CommonModule } from '@angular/common';
import { AutenticacionService } from '../api/autenticacion.service.js';
import { HeaderComponent } from "../header/header.component";
import { SidebarComponent } from "../sidebar/sidebar.component";
import { Router } from '@angular/router';
@Component({
  selector: 'app-cargo-productos',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe, CommonModule, HeaderComponent, SidebarComponent],
  templateUrl: './cargo-productos.component.html',
  styleUrl: './cargo-productos.component.css',
})
export class CargoProductosComponent {
  categorias$ = this.categoriaService.$;
  cantidadInvalida: boolean = false;
  cargaExitosa:boolean=false
  mensajeVisible!:string
  selectedFile: File | null = null;
errorStock:string|null=null
errorPrecio:string|null=null
precioInvalido = false;
muestraModalProducto=false
userId!:string
spinnerVisible=false
public publicaForm = new FormGroup({
  descripcion: new FormControl('', [Validators.required]),
  categoria: new FormControl('', [Validators.required]),
  precio: new FormControl('', [Validators.required, Validators.min(1)]),
  stock: new FormControl('', [Validators.required, Validators.min(1)]),
  detalle: new FormControl('', [Validators.required]),
  imagen: new FormControl(null, [Validators.required]),
});


  constructor(
    private crudService: CRUDService<Producto>,
    private router:Router,
    private categoriaService: CategoriaService,
    private autenticacionService:AutenticacionService
  ) {
    categoriaService.getAll('categorias');
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file; // ✅ Guardamos el archivo fuera del form
    }
  }


ngOnInit(){
  this.autenticacionService.getUserInformation().subscribe({
    next:(response:any)=>{
    console.log('Usuario encontrado',response.data)
    this.userId=response.data.id
    },
    error:(error:any)=>{
    
      console.error("No se encontro el usuario",error)
    }
})}

  onSubmit() {
  
this.cargaExitosa=true
this.spinnerVisible = true;
      
const producto: Producto = {
  descripcion: this.publicaForm.value.descripcion ?? '',
  stock: Number(this.publicaForm.value.stock),
  precio: Number(this.publicaForm.value.precio),
  categoriaId: this.publicaForm.value.categoria ?? '', 
  personaId: this.userId ?? '' , 
  detalle:this.publicaForm.value.detalle ?? '',
};

const formData = new FormData();
  formData.append('descripcion', this.publicaForm.value.descripcion ?? '');
  formData.append('stock', String(this.publicaForm.value.stock ?? 0));
  formData.append('precio', String(this.publicaForm.value.precio ?? 0));
  formData.append('categoriaId', this.publicaForm.value.categoria ?? '');
  formData.append('personaId', this.userId ?? '');
  formData.append('detalle', this.publicaForm.value.detalle ?? '');
  if (this.selectedFile) {
    formData.append('imagen', this.selectedFile);
  }

this.crudService.add('productos', formData);
this.mostrarNotificacion('Producto cargado con exito!')
    
  }


 
  mostrarNotificacion(mensaje: string) {
    this.mensajeVisible = mensaje;
    this.spinnerVisible = true;
    this.cargaExitosa = true;
  
    setTimeout(() => {
      this.spinnerVisible = false;
      this.cargaExitosa = false;
      this.router.navigate(['/productos']);
    }, 2000);
  }
  
abrirModalCarga(){
  this.muestraModalProducto=true
}
realizaCargaProducto(){
  this.muestraModalProducto=false
  this.onSubmit()

}
cancelarCarga() {
  this.muestraModalProducto = false;
}
}
