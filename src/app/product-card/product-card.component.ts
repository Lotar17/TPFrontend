import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { Producto } from '../../models/producto.entity';
import { RouterLink } from '@angular/router';
import { HistoricoPrecioService } from '../api/calculaprecio.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink,CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {


  @Input() producto!: Producto;
  precio!: number; 

  constructor(private historicoprecioService: HistoricoPrecioService) {}

  ngOnInit(): void {
    if (this.producto.id) {
      this.obtenerPrecio(this.producto.id); 
    }
  }

  obtenerPrecio(id: string): void {
    this.historicoprecioService.getOne(id).subscribe(
      (valor:any) => {
        if (valor !== undefined) {
          if(valor !== 0){this.precio = valor;}
          else{this.precio === 0} 
        } else {
          console.log('No se encontró el precio histórico');
        }
      },
      (error) => {
        console.error('Error al obtener el precio:', error);
      }
    );
  }
}
