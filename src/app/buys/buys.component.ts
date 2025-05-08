import { Component } from '@angular/core';
import { Item } from '../models/item.entity';
import { ComprasService } from '../api/compra.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl,FormsModule } from '@angular/forms';
import { SeguimientoService } from '../api/seguimiento.service';
import { Compra } from '../models/compra.entity';
import { PersonaService } from '../api/per.service';
import { AutenticacionService } from '../api/autenticacion.service';
import { Persona } from '../models/persona.entity';
import { Seguimiento } from '../models/seguimiento.entity';
import { Direccion } from '../models/direccion.entity';
import { Localidad } from '../models/localidad.entity';
import { Router, RouterLink } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
@Component({
  selector: 'app-buys',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule,RouterLink,HeaderComponent],
  templateUrl: './buys.component.html',
  styleUrl: './buys.component.css'
})
export class BuysComponent {
  idPersona!: string;
  items: Item[] = [];
  direcciones: Direccion[] = [];
  direccionSeleccionadaId: string = '';
  mostrarNuevaDireccion: boolean = false;

  compra!: Compra;
  cliente!: Persona;
  mailDestino!: string;
  localidades: Localidad[] = [];
spinner=false
  showConfirmModal: boolean = false;
  showDetailModal: boolean = false;
  compraRealizada: Compra | null = null;

  mensajeError: string = '';

  publicaForm = new FormGroup({
    direccion: new FormControl(),
    calle: new FormControl(),
    numero: new FormControl(),
    localidad: new FormControl()
  });

  constructor(
    private compraService: ComprasService,
    private autenticacionService: AutenticacionService,
    private seguimientoService: SeguimientoService,
    private personaService: PersonaService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadLocalidades();
    this.items = this.compraService.getItems();
    this.obtenerDatosUsuario();
  }

  obtenerDatosUsuario() {
    this.autenticacionService.getUserInformation().subscribe({
      next: (response: any) => {
        this.idPersona = response.data.id;

        if (this.idPersona) {
          this.personaService.getOne(this.idPersona).subscribe({
            next: (response) => {
              if(response.data)
              this.cliente = response.data;
              this.mailDestino = this.cliente.mail || '';

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
            }
          });
        }
      },
      error: (error) => {
        console.error('Error obteniendo información del usuario', error);
      }
    });
  }

  loadLocalidades() {
    this.seguimientoService.getLocalidades().subscribe({
      next: (response: any) => {
        this.localidades = response.data;
      },
      error: (error) => {
        console.error('No se pudieron cargar las localidades', error);
      }
    });
  }

  abrirNuevaDireccion() {
    this.mostrarNuevaDireccion = true;
    this.cdr.detectChanges();
  }

  onCancel(): void { 
    this.mostrarNuevaDireccion=false// si cancelo la compra nueva reseteo todos los campos a nulos
    this.publicaForm.get('calle')?.setErrors(null);
    this.publicaForm.get('numero')?.setErrors(null);
    this.publicaForm.get('localidad')?.setErrors(null);
  }


  confirmarCompra() { // Abre modal para confirmar la compra
    this.showConfirmModal = true;
  }

  cerrarModalConfirmacion() {
    this.showConfirmModal = false;
  }

  cerrarModalDetalle() {
    this.showDetailModal = false;
  }

  confirmarYEnviar() { // se confirma la compra aca
    if (this.publicaForm.invalid) {
      this.publicaForm.markAllAsTouched();
      return;
    }
    this.cerrarModalConfirmacion();
    this.onSubmit();
  }

  onSubmit() {
    if (this.publicaForm.invalid) {
      
      this.mostrarError('Por favor complete todos los campos requeridos');
      return;
    }
    
    
const itemSinStock = this.items.find(
  item => item.producto && item.cantidad_producto > (item.producto.stock ?? 0)
);

if (itemSinStock && itemSinStock.producto) {
  this.mostrarError(`El producto "${itemSinStock.producto.descripcion ?? ''} " no tiene suficiente stock disponible.`);
  return;
}

 


    if (this.mostrarNuevaDireccion) {
      if (!this.publicaForm.value.calle || !this.publicaForm.value.numero || !this.publicaForm.value.localidad) {
        this.mostrarError('Por favor, complete todos los campos de la nueva dirección.');
        return;
      }

      this.compra = {
        personaId: this.idPersona,
        items: this.items,
        calle: this.publicaForm.value.calle || '',
        numero: this.publicaForm.value.numero || 0,
        localidadId: this.publicaForm.value.localidad || '',
      };
    } else {
      if (!this.publicaForm.value.direccion) {
        this.mostrarError('Por favor, seleccione una dirección.');
        return;
      }

      this.compra = {
        personaId: this.idPersona,
        direccionId: this.publicaForm.value.direccion || '',
        items: this.items
      };
    }

    console.log('Compra a procesar:', this.compra);
   this.spinner=true
    this.compraService.procesarCompra(this.compra, this.idPersona, this.mailDestino)
      .subscribe({
        next: () => {
          this.spinner=false
          console.log("Compra procesada correctamente");
          this.showDetailModal = true;
    setTimeout(() => {
      this.showDetailModal = false;
      
      this.router.navigate(['/productos']);
    }, 1000);

        
        },
        error: (err) => {
          console.error("Error al procesar la compra:", err);
        }
      });
  }

  mostrarError(mensaje: string) {
    this.mensajeError = mensaje;
    setTimeout(() => {
      this.cdr.detectChanges();
      this.mensajeError = '';
    }, 3000);
  }
}

