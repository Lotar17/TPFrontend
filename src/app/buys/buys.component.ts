import { Component } from '@angular/core';
import { Item } from '../models/item.entity';
import { ComprasService } from '../api/compra.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';

import { Compra } from '../models/compra.entity';
import { error } from 'node:console';
import { AutenticacionService } from '../api/autenticacion.service';
import { response } from 'express';
@Component({
  selector: 'app-buys',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './buys.component.html',
  styleUrl: './buys.component.css'
})
export class BuysComponent {
  idPersona!: string;
  items: Item[] = [];
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
    private autenticacionService:AutenticacionService
  ) {}

  ngOnInit() {
    this.items = this.compraService.getItems();
    this.autenticacionService.getUserInformation().subscribe({
next:(response:any)=>{

  this.idPersona=response.data.id
}

    })
  }

  async onSubmit() {
    
    this.direccion_entrega = this.publicaForm.value.direccion_entrega || '';
    this.fecha_hora_compra = new Date().toISOString(); 


    
  
     this.compra = {
      personaId: this.idPersona, 
      direccion_entrega: this.direccion_entrega,
      fecha_hora_compra: this.fecha_hora_compra,
      items: this.items
    };
  console.log(this.compra)
    this.compraService.addCompra(this.compra).subscribe({
      next: (response: any) => {
        console.log("Respuesta del servidor, datos de la compra:", response.data); 
        
       
        if (response.data.id) {
          this.compraService.updateStock(response.data.id).subscribe({
            next: (response: any) => {
              console.log("Producto actualizado con éxito", response.data);
            },
            error: (error) => {
              console.error("Error al actualizar el producto", error);
            }
          });
        } else {
          console.error("Error: El ID de la compra no fue generado");
        }
      },
      error: (error) => {
        console.error('Error al registrar compra:', error);
      }
    });
  }}    
