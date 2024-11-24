import { Component } from '@angular/core';
import { Compra } from '../models/compra.entity.js';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EmpleadoService } from '../app/api/emp.service.js';
import { PersonaService } from '../app/api/per.service.js';
import { CRUDService } from '../app/api/crud.service.js';
import { ReactiveFormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs'; // Para convertir el Observable en Promise
import { CommonModule } from '@angular/common';
import { HistoricoPrecioService } from '../app/api/calculaprecio.service.js';
import { Producto } from '../models/producto.entity.js';
import { ProductosService } from '../app/api/producto.service.js';
import { AuthService } from '../app/api/Auth.service.js';

@Component({
  selector: 'app-comprar',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './comprar.component.html',
  styleUrls: ['./comprar.component.css'],
})
export class ComprarComponent {
  publicaForm = new FormGroup({
    direccion_entrega: new FormControl(),
    cantidad_producto: new FormControl(),
    fecha_hora_compra: new FormControl(),
    nombre_persona: new FormControl(), // Campo para ingresar el nombre de la persona
    nombre_empleado: new FormControl(), // Campo para ingresar el nombre del empleado
  });
  errorMessage: string = '';
  productoId: string; // ID del producto desde la URL
  precioActual!:number; //number | undefined;
  descuento!: number;
  precioTotal! :number;
  errorStock: string = ''
  prod !: Producto;
  stockMessage!: string;
  personaId!: string;
  compra!:Compra;
  precioHistorico!: number|undefined

  constructor(
    private route: ActivatedRoute, // Para capturar el ID del producto
    private crudService: CRUDService<Compra>,
    private empleadoService: EmpleadoService,
    private personaService: PersonaService,
    private historicoprecioService: HistoricoPrecioService,
    private productoService : ProductosService,
    private authService: AuthService
  ) {
    // Obtener el ID del producto desde la ruta activa
    this.productoId = this.route.snapshot.paramMap.get('id') || '';
    this.personaId= this.authService.getUserId()
    
  }


  validarCantidadProducto(form: FormGroup): boolean {
    if (form.value.cantidad_producto! <= 0) {
      this.errorMessage = 'La cantidad de producto debe ser mayor a 0.';
      return false;
    }
  
    // Limpia el mensaje de error si la validación pasa
    this.errorMessage = '';
    return true;
  }
  
  calcularTotal(precio: number, form: FormGroup): number {

    if (form && form.value.cantidad_producto >= 15) {

      return precio - precio * 0.2;
    }
    
    return precio;
  }


  validarStock(form: FormGroup, stockDisponible: number): boolean {
    if (form.value.cantidad_producto! > stockDisponible) {
      this.stockMessage = 'No se tiene el stock necesario';
      return false;
    }
  
  
    this.stockMessage = '';
    return true;
  }

  async onSubmit() {
    if (!this.validarCantidadProducto(this.publicaForm)) {
      // Detener si la cantidad no es válida
      return;
    }

   
    try {
      
      try {
       this.prod= await firstValueFrom(this.productoService.getOne(this.productoId));
  
        if (!this.prod || this.prod.stock === undefined) {
          console.error('Producto no encontrado o sin stock');
          this.errorMessage = 'Producto no disponible';
          return;
        }
  
        
        if (!this.validarStock(this.publicaForm, this.prod.stock)) {
          return;
        }
      } catch (error) {
        console.error('Error al obtener el producto:', error);
        this.errorMessage = 'Error al obtener el producto';
        return;
      }

      const empleadoId = await firstValueFrom(this.empleadoService.getEmpleadoIdByMail(this.publicaForm.value.nombre_empleado!));
     
    try{

      this.precioHistorico= await firstValueFrom(this.historicoprecioService.getOne(this.productoId));

      if (this.precioHistorico !== undefined) {
        this.precioActual = this.precioHistorico * this.publicaForm.value.cantidad_producto;
        this.precioTotal = this.calcularTotal(this.precioActual, this.publicaForm);
      } else {
        console.log('No se encontró el precio histórico');
      }} catch(error){
        console.error('error a obtener el precio actual',error)
      }
    
      
       this.compra = {
        direccion_entrega: this.publicaForm.value.direccion_entrega!,
        cantidad_producto: this.publicaForm.value.cantidad_producto!,
        fecha_hora_compra: this.publicaForm.value.fecha_hora_compra!,
        empleado: empleadoId, 
        persona: this.personaId, 
        producto: this.productoId 
      };

      await this.crudService.add('compras', this.compra); 
      console.log('Compra realizada con éxito');
      
      const nuevoStock = this.prod.stock - this.publicaForm.value.cantidad_producto!;
console.log(nuevoStock)
console.log(this.prod)
      const productoActualizado: Producto = {
        ...this.prod,
        stock: nuevoStock, 
        precio: this.precioHistorico
      };
      
     
      await this.crudService.update('productos', productoActualizado);

  } catch (error) {
    console.error('Error al realizar la compra o actualizar el stock:', error);
  }

   
  }
}
