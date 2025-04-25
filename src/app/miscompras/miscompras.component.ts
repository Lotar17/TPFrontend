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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from "../header/header.component";


@Component({
  selector: 'app-mis-compras',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, HeaderComponent],
  templateUrl: './miscompras.component.html',
  styleUrl: './miscompras.component.css'
})
export class MisComprasComponent {
  MisCompras: Compra[] = [];
  personaId!: string;
  mis_productos:Producto[]= [];

  filtroMes: string = '';
filtroVendedor: string = '';
soloNoLlegados: boolean = false;
mensajeDevolucion:string|null=null
mesesDisponibles = [
  { value: '01', label: 'Enero' },
  { value: '02', label: 'Febrero' },
  { value: '03', label: 'Marzo' },
  { value: '04', label: 'Abril' },
  { value: '05', label: 'Mayo' },
  { value: '06', label: 'Junio' },
  { value: '07', label: 'Julio' },
  { value: '08', label: 'Agosto' },
  { value: '09', label: 'Septiembre' },
  { value: '10', label: 'Octubre' },
  { value: '11', label: 'Noviembre' },
  { value: '12', label: 'Diciembre' },
];
compraSeleccionada: Compra | null = null;

abrirDetalles(compra: Compra) {
  this.compraSeleccionada = compra;
}

cerrarDetalles() {
  this.compraSeleccionada = null;
}



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
      this.mensajeDevolucion='La compra fue anterior a los ultimos 30 dias, no se puede devolver ningun producto de la misma'
    }
  }

  getProductoDescripcion(item: any): string {
    if (item.producto && item.producto.descripcion) {
      return item.producto.descripcion;
    }
    return ''; // Retorna un valor predeterminado si no tiene descripción
  }
  getComprasFiltradasPorItem(): Compra[] {
    return this.MisCompras
      .map(compra => {
        const fechaCompra = compra.fecha_hora_compra ? new Date(compra.fecha_hora_compra) : null;
        const mes = fechaCompra ? fechaCompra.toISOString().slice(5, 7) : '';
  
        if (!compra.items) return null; // Comprobamos si 'items' es undefined
  
        const itemsFiltrados = compra.items.filter(item => {
          const coincideMes = !this.filtroMes || this.filtroMes === mes;
          const coincideVendedor = !this.filtroVendedor || (
            item.producto?.persona &&
            (item.producto.persona.nombre + ' ' + item.producto.persona.apellido)
              .toLowerCase()
              .includes(this.filtroVendedor.toLowerCase())
          );
          const coincideLlegada = !this.soloNoLlegados || item.seguimiento?.estados?.length !== 4;
  
          return coincideMes && coincideVendedor && coincideLlegada;
        });
  
        // Solo devolver la compra si hay ítems filtrados
        if (itemsFiltrados.length > 0) {
          return {
            ...compra,
            items: itemsFiltrados
          };
        }
  
        return null;
      })
      .filter(c => c !== null) as Compra[]; // Filtramos valores null
  }
  
 
  
}
  


