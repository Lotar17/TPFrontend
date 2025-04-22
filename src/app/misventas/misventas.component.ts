import { Component } from '@angular/core';
import { ItemService } from '../api/item.service';
import { Item } from '../models/item.entity';
import { AutenticacionService } from '../api/autenticacion.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-misventas',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './misventas.component.html',
  styleUrl: './misventas.component.css'
})
export class MisventasComponent {
  misVentas: Item[] = [];
  ventaSeleccionada: Item | null = null;
  filtroMes: string = '';
  filtroVendedor: string = '';
  filtroNoEntregado: boolean = false;


  // Filtros
  mesSeleccionado: string = '';
  meses = [
    { nombre: 'Enero', valor: '01' },
    { nombre: 'Febrero', valor: '02' },
    { nombre: 'Marzo', valor: '03' },
    { nombre: 'Abril', valor: '04' },
    { nombre: 'Mayo', valor: '05' },
    { nombre: 'Junio', valor: '06' },
    { nombre: 'Julio', valor: '07' },
    { nombre: 'Agosto', valor: '08' },
    { nombre: 'Septiembre', valor: '09' },
    { nombre: 'Octubre', valor: '10' },
    { nombre: 'Noviembre', valor: '11' },
    { nombre: 'Diciembre', valor: '12' }
  ];

  constructor(
    private itemService: ItemService,
    private autenticacionService: AutenticacionService
  ) {}

  ngOnInit(): void {
    this.cargarMisVentas();
  }

  cargarMisVentas(): void {
    this.autenticacionService.getUserInformation().subscribe({
      next: (response: any) => {
        const idUser = response.data.id;
        this.itemService.getVentasByUser(idUser).subscribe({
          next: (response: any) => {
            this.misVentas = response.data;
          
          },
          error: (error: any) => {
            console.error('No se encontraron ventas', error);
          }
        });
      },
      error: (error: any) => {
        console.error('No se encontró el usuario', error);
      }
    });
  }

  // Filtro por mes
  ventasFiltradas(): any[] {
    return this.misVentas.filter((item) => {
let fecha, mesVenta
      if(item.compra)
      if (this.filtroMes && !item.compra.fecha_hora_compra) return false;
      if(item.compra?.fecha_hora_compra)
       fecha = new Date(item.compra.fecha_hora_compra);
      if(fecha)
       mesVenta = (fecha.getMonth() + 1).toString().padStart(2, '0');
      if (this.filtroMes && mesVenta !== this.filtroMes) return false;
      

      

      return true;
    });}

  abrirModal(venta: Item): void {
    this.ventaSeleccionada = venta;
  }
  
  cerrarModal(): void {
    this.ventaSeleccionada = null;
  }
  
}
