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
  precioTotal! :number

  constructor(
    private route: ActivatedRoute, // Para capturar el ID del producto
    private crudService: CRUDService<Compra>,
    private empleadoService: EmpleadoService,
    private personaService: PersonaService,
    private historicoprecioService: HistoricoPrecioService,
  ) {
    // Obtener el ID del producto desde la ruta activa
    this.productoId = this.route.snapshot.paramMap.get('id') || '';
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


  async onSubmit() {
    if (!this.validarCantidadProducto(this.publicaForm)) {
      // Detener si la cantidad no es válida
      return;
    }


    
    
    try {

      const empleadoId = await firstValueFrom(this.empleadoService.getEmpleadoIdById(this.publicaForm.value.nombre_empleado!));
      const personaId = await firstValueFrom(this.personaService.getPersonaIdById(this.publicaForm.value.nombre_persona!));
    

      this.historicoprecioService.getOne(this.productoId).subscribe(
        (valor) => {
          if (valor !== undefined) {
            this.precioActual = valor*this.publicaForm.value.cantidad_producto;
            this.precioTotal = this.calcularTotal(this.precioActual, this.publicaForm);
          } else {
            console.log('No se encontró el precio histórico');
          }
        },
        (error) => {
          console.error('Error al obtener el precio:', error);
        }
      );
      
    
      
      const compra: Compra = {
        direccion_entrega: this.publicaForm.value.direccion_entrega!,
        cantidad_producto: this.publicaForm.value.cantidad_producto!,
        fecha_hora_compra: this.publicaForm.value.fecha_hora_compra!,
        empleado: empleadoId, // ID del empleado obtenido por nombre
        persona: personaId, // ID de la persona obtenido por nombre
        producto: this.productoId // ID del producto desde la URL
      };

      await this.crudService.add('compras', compra); // Guardar la compra en la base de datos
      console.log('Compra realizada con éxito');
    } catch (error) {
      console.error('Error al realizar la compra:', error);
    }
  }
}
