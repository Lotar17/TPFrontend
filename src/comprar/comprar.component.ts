import { Component } from '@angular/core';
import { Compra } from '../models/compra.entity.js';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EmpleadoService } from '../app/api/emp.service.js';
import { PersonaService } from '../app/api/per.service.js';
import { CRUDService } from '../app/api/crud.service.js';
import { ReactiveFormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs'; // Para convertir el Observable en Promise

@Component({
  selector: 'app-comprar',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './comprar.component.html',
  styleUrls: ['./comprar.component.css'],
})
export class ComprarComponent {
  publicaForm = new FormGroup({
    direccion_entrega: new FormControl(),
    cantidad_producto: new FormControl(),
    fecha_hora_compra: new FormControl(),
    descuento: new FormControl(),
    nombre_persona: new FormControl(), // Campo para ingresar el nombre de la persona
    nombre_empleado: new FormControl(), // Campo para ingresar el nombre del empleado
  });

  productoId: string; // ID del producto desde la URL

  constructor(
    private route: ActivatedRoute, // Para capturar el ID del producto
    private crudService: CRUDService<Compra>,
    private empleadoService: EmpleadoService,
    private personaService: PersonaService
  ) {
    // Obtener el ID del producto desde la ruta activa
    this.productoId = this.route.snapshot.paramMap.get('id') || '';// el problema esta aca
  }

  async onSubmit() {
    try {
      // Obtener el ID del empleado y persona por nombre utilizando firstValueFrom para convertir los Observables en Promises
      const empleadoId = await firstValueFrom(this.empleadoService.getEmpleadoIdById(this.publicaForm.value.nombre_empleado!));
      const personaId = await firstValueFrom(this.personaService.getPersonaIdById(this.publicaForm.value.nombre_persona!));

      const compra: Compra = {
        direccion_entrega: this.publicaForm.value.direccion_entrega!,
        cantidad_producto: this.publicaForm.value.cantidad_producto!,
        fecha_hora_compra: this.publicaForm.value.fecha_hora_compra!,
        descuento: this.publicaForm.value.descuento!,
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
