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
@Component({
  selector: 'app-buys',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './buys.component.html',
  styleUrl: './buys.component.css'
})
export class BuysComponent {
  idPersona!: string;
  items: Item[] = [];
  direccion_entrega!: string;
 
  compra!:Compra;
  producto!:string;
  cantidad_producto!:number;
  empleado!:Persona
  seguimiento!:Seguimiento
itemIds:string[]=[]
cliente!:Persona
 direcciones: Direccion[] = [];
 direccionSeleccionadaId: string = '';
 showConfirmModal: boolean = false;
showDetailModal: boolean = false;
compraRealizada: Compra | null = null;

 
 mailDestino!:string


mostrarNuevaDireccion: boolean = false;


localidades:Localidad[]=[]

  publicaForm = new FormGroup({
    direccion: new FormControl(),
    calle: new FormControl(),
    numero: new FormControl(),
    localidad: new FormControl()
  });

  constructor(
    private compraService: ComprasService,
    private autenticacionService:AutenticacionService,
    private seguimientoService:SeguimientoService,
    private personaService:PersonaService,

  ) {}

  ngOnInit() {
    this.loadLocalidades()

    this.items = this.compraService.getItems();
    this.autenticacionService.getUserInformation().subscribe({
next:(response:any)=>{

  this.idPersona=response.data.id
  if(this.idPersona){
this.personaService.getOne(this.idPersona).subscribe({

  next:(response)=>{
    console.log('Persona recibida con exito',response.data)
    if(response.data)
this.cliente=response.data
    if(response.data?.mail)
this.mailDestino=response.data?.mail

    if (this.cliente.direccion) {
      this.direcciones.push(this.cliente.direccion);
    }
    console.log('Array direcciones',this.direcciones)
    if(this.cliente.compras)
    this.cliente.compras.forEach(compra => {
      if (compra.direccion) {
        this.direcciones.push(compra.direccion);
      }
    });
   this. direcciones = this. direcciones.filter((dir, i, self) =>
      i === self.findIndex(d => d.calle === dir.calle && d.numero === d.numero)
    );
  }});
  console.log('Array direcciones2',this.direcciones)
}
  },
  error:(error)=>{

  }
})

  }



  async onSubmit() {
    this.direccion_entrega = this.publicaForm.value.direccion || '';
   
  
    if (this.mostrarNuevaDireccion) {
    
      this.compra = {
        personaId: this.idPersona,
     
        items: this.items,
        calle: this.publicaForm.value.calle || '',
        numero: this.publicaForm.value.numero || 0,
        localidadId: this.publicaForm.value.localidad || '',
      };
    } else {
    
      this.compra = {
        personaId: this.idPersona,
        direccionId: this.direccion_entrega,
        items: this.items
      };
    }
  
    console.log(this.compra);
    this.compraService.procesarCompra(this.compra, this.idPersona, this.mailDestino)
    .subscribe({
      next: () => {
        console.log("Compra procesada correctamente");
      },
      error: (err) => {
        console.error("Error al procesar la compra:", err);
      }
    });
  
   
  }
  
loadLocalidades(){
this.seguimientoService.getLocalidades().subscribe({
next:(response:any)=>{
this.localidades=response.data
},error:(error:any)=>{
  console.error('No se encontraron localidades',error)
}})}

confirmarCompra() {
  this.showConfirmModal = true;
}
confirmarYEnviar() {
  this.cerrarModalConfirmacion(); // opcional, si querés cerrar antes
  this.onSubmit();
  this.showDetailModal = true; 
}
cerrarModalConfirmacion() {
  this.showConfirmModal = false;
}


cerrarModalDetalle() {
  this.showDetailModal = false;
  this.compraRealizada = null;
}
}    
