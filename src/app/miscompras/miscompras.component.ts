import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComprasService } from '../api/compra.service';
import { Compra } from '../models/compra.entity';
import { AuthService } from '../api/Auth.service';
import { Producto } from '../models/producto.entity';
import { ProductosService } from '../api/producto.service';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';


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
    private authService: AuthService,
    private productoService: ProductosService,
    private router:Router
  ) {}

  ngOnInit(): void {
    this.loadMisCompras();
  }

  loadMisCompras(): void {
    this.personaId = this.authService.getUserId();
  
    this.compraService.getcomprasByUser(this.personaId).subscribe((response: any) => {
      if (response && Array.isArray(response.data)) {
        this.MisCompras = response.data;

     
      }
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
  


