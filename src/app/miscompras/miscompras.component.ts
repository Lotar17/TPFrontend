import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComprasService } from '../api/compra.service';
import { Compra } from '../models/compra.entity';
import { AutenticacionService } from '../api/autenticacion.service';
import { Producto } from '../models/producto.entity';
import { ProductosService } from '../api/producto.service';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { HistoricoPrecioService } from '../api/calculaprecio.service';


import { Item } from '../models/item.entity';


@Component({
  selector: 'app-mis-compras',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './miscompras.component.html',
  styleUrl: './miscompras.component.css'
})
export class MisComprasComponent {
  MisCompras: Compra[] = [];
  personaId!: string;
  mis_productos:Producto[]= [];



  constructor(
    private compraService: ComprasService,
    private autenticacionService:AutenticacionService,
    private productoService: ProductosService,
    private router:Router,
    private historicoPrecioService:HistoricoPrecioService
  ) {}

  ngOnInit(): void {
    this.loadMisCompras();
  }

  loadMisCompras(): void {
    this.autenticacionService.getUserInformation().subscribe({
      next: (response: any) => {
        const userId = response.data.id;
  
        this.compraService.getcomprasByUser(userId).subscribe((response: any) => {
          if (response && Array.isArray(response.data)) {
            const todasLasCompras = response.data;
  
            // Filtrar compras activas (al menos un item con cantidad > 0)
            this.MisCompras = todasLasCompras.filter((compra: any) => {
              return compra.items?.some((item: any) => item.cantidad_producto > 0);
            });
  
            // Recorremos cada compra y sus items para obtener el precio
            this.MisCompras.forEach((compra: any) => {
              if(compra.items)
              compra.items.forEach((item: any) => {
                if (item.producto?.id) {
                  this.historicoPrecioService.getOne(item.producto.id).subscribe({
                    next: (precioData: any) => {
                      console.log(`Precio recibido para producto ${item.producto.id}:`, precioData);
                      item.producto.precio = precioData; // Asignamos el precio unitario
                    },
                    error: (error: any) => {
                      console.error(`Error obteniendo precio para producto ${item.producto.id}:`, error);
                    }
                  });
                }
              });
            });
          }
        });
      },
      error: (err) => console.error("Error obteniendo usuario", err)
    });
  }
  
  
  
  
  
 
  validarDevolucion(fechaCompra?:string, id_compra?:string) {
    
    const fechaActual = new Date();
    const fechaCompraDate = new Date(fechaCompra!);
    
    
   
    const diferenciaTiempo = fechaActual.getTime() - fechaCompraDate.getTime();
    
    
    const diferenciaDias = diferenciaTiempo / (1000 * 60 * 60 * 24);
  
    
    
    if (diferenciaDias<30) {
      this.router.navigate(['/devolucion', id_compra]);
    } else {
      alert('No se puede devolver, la compra es de otro mes');
    }
  }

  getProductoDescripcion(item: any): string {
    if (item.producto && item.producto.descripcion) {
      return item.producto.descripcion;
    }
    return ''; // Retorna un valor predeterminado si no tiene descripción
  }

}
  


