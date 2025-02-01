import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComprasService } from '../api/compra.service';
import { Compra } from '../../models/compra.entity';
import { AuthService } from '../api/Auth.service';
import { Producto } from '../../models/producto.entity';
import { ProductosService } from '../api/producto.service';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mis-compras',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './mis-compras.component.html',
  styleUrl: './mis-compras.component.css'
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

        this.MisCompras.forEach((compra) => {
          if (typeof compra.producto === 'string') {
            this.productoService.getOne(compra.producto).subscribe({
              next: (producto: Producto) => {
                this.mis_productos.push(producto);
              },
              error: (err) => console.error('Error obteniendo producto:', err)
            });
          }
        });
        
      } else {
        this.MisCompras = [];
        this.mis_productos=[];
      }
    });

   
    
  }
  
  getProductoDescripcion(producto: string | Producto | undefined): string {
    if (typeof producto === 'string') {
      
      const prod = this.mis_productos.find(p => p.id === producto);
      return prod ? prod.descripcion : 'Producto no encontrado';
    } else if (producto && producto.descripcion) {
      
      return producto.descripcion;
    } else {
      return 'Producto no encontrado';
    }
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
}
  



