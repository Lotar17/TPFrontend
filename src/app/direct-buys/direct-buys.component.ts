import { Component } from '@angular/core';
import { Direccion } from '../models/direccion.entity';
import { Localidad } from '../models/localidad.entity';
import { ComprasService } from '../api/compra.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductosService } from '../api/producto.service';
import { Producto } from '../models/producto.entity';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CarritoService } from '../api/cart.service';
import { Item } from '../models/item.entity';
import { Compra } from '../models/compra.entity';
import { CommonModule } from '@angular/common';
import { AutenticacionService } from '../api/autenticacion.service';
import { concatMap, switchMap, from, catchError, tap, of } from 'rxjs';
import { SeguimientoService } from '../api/seguimiento.service';
import { PersonaService } from '../api/per.service';
import { Persona } from '../models/persona.entity';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HistoricoPrecioService } from '../api/calculaprecio.service';
import { HeaderComponent } from '../header/header.component';
@Component({
  selector: 'app-direct-buys',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,RouterLink,HeaderComponent],
  templateUrl: './direct-buys.component.html',
  styleUrls: ['./direct-buys.component.css']
})
export class DirectBuysComponent {
  productoId!: string;
  producto!: Producto;
  idPersona!: string;
  idUser!: string;
  cliente!: Persona;
  direcciones: Direccion[] = [];
  localidades: Localidad[] = [];
  compradorDestinatario!: string;
  items: Item[] = [];
  compra!: Compra;
  muestraDetalle = false;
  muestraCompra: Compra | null = null;
  confirmaCompra = false;
  formInvalido: boolean = false;
  mensajeError: string | null = null;
  cantidadInvalida: boolean = false;
  mensajeVisible: string = '';
  mostrarNuevaDireccion: boolean = false;
  precio!:number
spinner=false
  publicaForm = new FormGroup({
    direccion: new FormControl(),
    cantidad_producto: new FormControl(),
    calle: new FormControl('', [Validators.required]),
    numero: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
    localidad: new FormControl('', Validators.required)
  });

  constructor(
    private compraService: ComprasService,
    private route: ActivatedRoute,
    private autenticacionService: AutenticacionService,
    private productoService: ProductosService,
    private carritoService: CarritoService,
    private seguimientoService: SeguimientoService,
    private personaService: PersonaService,
    private router: Router,
    private historicoPrecioService:HistoricoPrecioService
  ) { }

  ngOnInit(): void {
    this.loadLocalidades();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.getOne(id);
    }
    this.loadUserData();
  }

  loadUserData(): void {
    this.autenticacionService.getUserInformation().subscribe({
      next: (response: any) => {
        this.idUser = response.data.id;
        if (this.idUser) {
          this.personaService.getOne(this.idUser).subscribe({
            next: (response: any) => {
              this.cliente = response.data;
              this.compradorDestinatario = this.cliente.mail;
              if (this.cliente.direccion) {
                this.direcciones.push(this.cliente.direccion);
              }
              if (this.cliente.compras) {
                this.cliente.compras.forEach(compra => {
                  if (compra.direccion) {
                    this.direcciones.push(compra.direccion);
                  }
                });
              }
              this.direcciones = this.direcciones.filter((dir, i, self) =>
                i === self.findIndex(d => d.calle === dir.calle && d.numero === dir.numero)
              );
            },
            error: (error: any) => {
              console.error("No se encontró el usuario", error);
            }
          });
        }
      },
      error: (error: any) => {
        console.error("No se encontró el usuario", error);
      }
    });
  }

  getOne(id: string): void {
    this.productoService.getOne(id).subscribe({
      next: (producto: Producto) => {
        this.producto = producto;
        if(this.producto.id){
          this.historicoPrecioService.getOne(this.producto.id).subscribe({
            next:(response:any)=>{
this.precio=response
            },
            error:(error:any)=>{
            
              console.error("No se obtuvo el precio",error)
            }
            
          })
        }
      },
      error: (error) => {
        console.error('Error al obtener el producto:', error);
      }
    });
  }

  loadLocalidades(): void {
    this.seguimientoService.getLocalidades().subscribe({
      next: (response: any) => {
        this.localidades = response.data;
      },
      error: (error: any) => {
        console.error('Error al obtener localidades', error);
      }
    });
  }

  mostrarError(mensaje: string): void {
    this.mensajeError = mensaje;
  }

  cerrarError(): void { // Modal para cerrar el error
    this.mensajeError = null;
  }

  confirmarCompra(): void { // Modal para confirmar la compra
    if (!this.cantidadInvalida) {
      this.confirmaCompra = true;
    }
  }

  confirmarYEnviar(): void { // Aca se ejecuta la compra
    if (this.formInvalido) { // valido todos los campos de el form
      this.mensajeError = 'Por favor, completa todos los campos.';
      return;
    }
    this.onSubmit();
  }

  validarCampos(): boolean {
    if (this.mostrarNuevaDireccion) {
      return this.publicaForm.valid && !this.cantidadInvalida;
    }
    return (this.publicaForm.get('direccion')?.valid ?? false) && !this.cantidadInvalida;

  }

  onSubmit(): void {
    const cantidad = this.publicaForm.value.cantidad_producto;
  
   
    if (!this.producto || cantidad <= 0 || (this.producto.stock && cantidad > this.producto.stock)) {
      console.error("Error en los datos del producto o cantidad.");
      this.mostrarError('La cantidad es inválida o el producto no está disponible o la cantidad no fue ingresada.');
      return;
    }
  
    const direccionSeleccionada = this.publicaForm.value.direccion;
    if (!direccionSeleccionada && !this.mostrarNuevaDireccion) {
      this.publicaForm.get('direccion')?.markAsTouched(); 
      
      this.mostrarError('Debes seleccionar o ingresar una dirección.');
      return;
    }

    if (this.mostrarNuevaDireccion) {
      if (!this.publicaForm.value.calle || !this.publicaForm.value.numero || !this.publicaForm.value.localidad) {
        console.error("Error: faltan campos en la nueva dirección.");
        this.mostrarError('Por favor, ingresa todos los campos de la nueva dirección.');
        return;
      }
    }
  
    
    this.carritoService.createItem(this.producto.id!, this.idUser, cantidad).subscribe({
      next: (response: any) => {
        this.items = [response.data]; 
  
        
        if (this.mostrarNuevaDireccion) {
          this.compra = {
            personaId: this.idUser,
            items: this.items,
            calle: this.publicaForm.value.calle!,
            numero: Number(this.publicaForm.value.numero!),
            localidadId: this.publicaForm.value.localidad!,
          };
        } else {
         
          this.compra = {
            personaId: this.idUser,
            direccionId: direccionSeleccionada,
            items: this.items
          };
        }
  this.spinner=true
     this.confirmaCompra=false 
        this.compraService.procesarCompra(this.compra, this.idUser, this.compradorDestinatario)
          .subscribe({
            next: () => {
              this.spinner=false
             
              this.muestraCompra = this.compra;
             
              this.muestraDetalle = true;
            },
            error: (err) => {
              console.error("Error al procesar la compra:", err);
            }
          });
      },
      error: (error) => {
        this.spinner=false
        console.error("Error al crear item en el carrito:", error);
      }
    });
  }
  
  cerrarModalConfirmacion(): void {
    this.confirmaCompra = false;
  }

  cerrarModalDetalle(): void {
    this.muestraDetalle = false;
    this.router.navigate(['/productos']);
  }

  onCancel(): void { // si cancelo la compra nueva reseteo todos los campos a nulos
    this.mostrarNuevaDireccion = false;
    this.publicaForm.get('calle')?.reset();
    this.publicaForm.get('numero')?.reset();
    this.publicaForm.get('localidad')?.reset();
  }

  validarCantidad(): void {
    const cantidad = this.publicaForm.value.cantidad_producto;
    if (this.producto.stock) {
      this.cantidadInvalida = cantidad <= 0 || cantidad > this.producto.stock;
      if (this.cantidadInvalida) {
        if (cantidad <= 0) {
          this.mostrarError('La cantidad debe ser mayor a cero.');
        } else {
          this.mostrarError(`La cantidad no puede superar el stock disponible (${this.producto.stock}).`);
        }
      } else {
        this.cerrarError();
      }
    }
  }
}

