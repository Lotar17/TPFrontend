import { Component } from '@angular/core';
import { AuthService } from '../api/Auth.service';
import { ComprasService } from '../api/compra.service';
import { ActivatedRoute, Route } from '@angular/router';
import { ProductosService } from '../api/producto.service';
import { Producto } from '../models/producto.entity';
import { error } from 'console';
import { FormGroup,FormControl,ReactiveFormsModule } from '@angular/forms';
import { CarritoService } from '../api/cart.service';
import { Item } from '../models/item.entity';
import { response } from 'express';
import { Compra } from '../models/compra.entity';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-direct-buys',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './direct-buys.component.html',
  styleUrl: './direct-buys.component.css'
})
export class DirectBuysComponent {
  productoId!:string
producto!: Producto
idPersona!:string
direccion_entrega!:string
fecha_hora_compra!:string
idProducto!:string
cantidad_producto!:number
items: Item[] = []
compra!:Compra
item!:Item
compraExitosa:boolean= false;
mensajeVisible:string=''


  constructor(
    private compraService: ComprasService,
    private authService: AuthService,
    private route:ActivatedRoute,
    
    private productoService:ProductosService,
    private carritoService:CarritoService
  ) {}

  publicaForm = new FormGroup({
    direccion_entrega: new FormControl(),
    cantidad_producto: new FormControl()
  });
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id'); 
    if (id) {
      this.getOne(id);
     
      
    }
  }
// aca calcular el precio para el producto

  getOne(id: string): void { 
    this.productoService.getOne(id).subscribe(
      (producto: Producto) => { // Espera un Producto
        this.producto = producto; // Asigna el producto recuperado
      },
      (error) => {
       
        console.error('Error fetching product:', error);
      }
    );
    
  }
 async  onSubmit() {
    console.log("✅ Iniciando proceso de compra...");
  
    this.idPersona = this.authService.getUserId();
    this.direccion_entrega = this.publicaForm.value.direccion_entrega || '';
    this.fecha_hora_compra = new Date().toISOString();
    this.cantidad_producto = this.publicaForm.value.cantidad_producto;
    this.compraExitosa = true;

    if (!this.producto) {
      console.error("❌ Error: El producto no se ha cargado correctamente.");
      return;
    }
  
    console.log("📌 Producto cargado correctamente:", this.producto);
    console.log("📌 Creando item en el carrito...");
  if(this.producto.id)
    
    this.carritoService.createItem(this.producto.id, this.idPersona, this.cantidad_producto).subscribe({
      next: (response: any) => {
        if (!response || !response.data) {
          console.error("❌ Error: La respuesta del servidor no contiene datos del item.");
          return;
        }
  
        console.log("✅ Item creado con éxito:", response.data);
  
     console.log("Hasta aca anda")
        this.items[0]=response.data
  
        console.log("📌 Items actuales:", this.items);
  
        // Crear la compra
        this.compra = {
          personaId: this.idPersona,
          direccion_entrega: this.direccion_entrega,
          fecha_hora_compra: this.fecha_hora_compra,
          items: this.items
        };
  
        console.log("📌 Enviando compra al servidor:", this.compra);
  
       
        if (!this.compra.personaId || !this.compra.direccion_entrega || !this.compra.fecha_hora_compra) {
          console.error("❌ Error: Datos incompletos para la compra.");
          return;
        }
  
        // Intentamos crear la compra
        this.compraService.addCompra(this.compra).subscribe({
          next: (response: any) => {
            console.log("✅ Respuesta de creación de compra:", response);
  
            if (!response.data || !response.data.id) {
              console.error("❌ Error: La respuesta del servidor no contiene el ID de la compra.");
              return;
            }
            this.mostrarNotificacion(`Compra creada con exito`);
            console.log("✅ Compra creada con éxito:", response.data);
  
            // Actualizar stock solo si la compra se creó correctamente
            this.compraService.updateStock(response.data.id).subscribe({
              next: (stockResponse: any) => {
                console.log("✅ Stock actualizado con éxito", stockResponse.data);
              },
              error: (error) => {
                console.error("❌ Error al actualizar el producto:", error);
              }
            });
          },
          error: (error) => {
            console.error("❌ Error al realizar la compra:", error);
          }
        });
      },
      error: (error) => {
        console.error("❌ Error al agregar item al carrito:", error);
      }
    });
  }
  mostrarNotificacion(mensaje: string) {
    this.mensajeVisible = mensaje;
    this.compraExitosa= true;

    // Ocultar el cartel después de 3 segundos
    setTimeout(() => {
      this.compraExitosa = false;
   
    }, 3000);
  }
}

