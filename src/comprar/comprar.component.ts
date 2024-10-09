import { Component } from '@angular/core';
import { Compra } from '../models/compra.entity.js';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ComprasService } from '../app/api/compra.service';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-comprar',
  standalone: true,
  imports:[ReactiveFormsModule],
  templateUrl: './comprar.component.html',
  styleUrls: ['./comprar.component.css'],
})
export class ComprarComponent {
  compraForm: FormGroup;
  productoId: string = '';

  constructor(private comprasService: ComprasService, private route: ActivatedRoute) {
    this.compraForm = new FormGroup({
      direccion_entrega: new FormControl('', { nonNullable: true }),
      persona: new FormControl('', { nonNullable: true }),      // ID del cliente
      empleado: new FormControl('', { nonNullable: true }),     // ID del empleado
      cantidad_producto: new FormControl(0, { nonNullable: true }),
      fecha_hora_compra: new FormControl(new Date().toISOString(), { nonNullable: true }),
      descuento: new FormControl(0, { nonNullable: true }),
    });
    

    this.productoId = this.route.snapshot.paramMap.get('productoId') || '';
  }
  finalizarCompra() {
    const compra: Compra = {
      direccion_entrega: this.compraForm.value.direccion_entrega, // Usar el nombre correcto
      producto: this.productoId,                                   // Usar el ID del producto
      persona: this.compraForm.value.persona,                     // ID del cliente
      cantidad_producto: this.compraForm.value.cantidad_producto, // Cantidad del producto
      fecha_hora_compra: this.compraForm.value.fecha_hora_compra, // Fecha de la compra
      descuento: this.compraForm.value.descuento,                 // Descuento aplicado
      empleado: this.compraForm.value.empleado,                   // ID del empleado
    };
    

    this.comprasService.add(compra).subscribe({
      next: () => {
        console.log('Compra guardada exitosamente');
      },
      error: (err) => {
        console.error('Error al guardar la compra', err);
      },
    });
  }
}