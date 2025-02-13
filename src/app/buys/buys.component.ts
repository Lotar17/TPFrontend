import { Component } from '@angular/core';
import { item_Compra } from '../../models/compra.entity';
import { ComprasService } from '../api/compra.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../api/Auth.service';
import { Compra } from '../../models/compra.entity';
import { item } from '../models/item.entity';
@Component({
  selector: 'app-buys',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './buys.component.html',
  styleUrl: './buys.component.css'
})
export class BuysComponent {
  idPersona!: string;
  items: item_Compra[] = [];
  direccion_entrega!: string;
  fecha_hora_compra!: string;
  compra!:Compra;
  producto!:string;
  cantidad_producto!:number

  publicaForm = new FormGroup({
    direccion_entrega: new FormControl()
  });

  constructor(
    private compraService: ComprasService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.items = this.compraService.getItems();
  }

  async onSubmit() {
    this.idPersona = this.authService.getUserId();
    this.direccion_entrega = this.publicaForm.value.direccion_entrega || '';
    this.fecha_hora_compra = new Date().toISOString(); 
  
     this.compra = {
      persona: this.idPersona, 
      direccion_entrega: this.direccion_entrega,
      fecha_hora_compra: this.fecha_hora_compra,
      items: this.items.map(item => ({
        producto: item.producto && typeof item.producto === "object" ? (item.producto as any).id : item.producto, 
        cantidad_producto: item.cantidad_producto
      }))
    };
  
    this.compraService.addCompra(this.compra).subscribe({
      next: (response:any) => {
           console.log("Respuesta del servidor:", response.data); 
           
       },
      error: (error) => {
           console.error('Error al registrar compra:', error);
       }
   });
    
  }
}  
