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
import { concatMap,switchMap,tap } from 'rxjs';
import { from ,of} from 'rxjs';
import { catchError } from 'rxjs';
import { CorreoService } from '../api/correo.service';
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
  fecha_hora_compra!: string;
  compra!:Compra;
  producto!:string;
  cantidad_producto!:number;
  empleado!:Persona
  seguimiento!:Seguimiento
itemIds:string[]=[]
cliente!:Persona
 direcciones: Direccion[] = [];
 direccionSeleccionadaId: string = '';
 mailOrigen!:string
 mailDestino!:string
mailAsunto!:string
mailMensaje!:string

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
    private correoService:CorreoService
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
    this.fecha_hora_compra = new Date().toISOString();
  
    if (this.mostrarNuevaDireccion) {
    
      this.compra = {
        personaId: this.idPersona,
        fecha_hora_compra: this.fecha_hora_compra,
        items: this.items,
        calle: this.publicaForm.value.calle || '',
        numero: this.publicaForm.value.numero || 0,
        localidadId: this.publicaForm.value.localidad || '',
      };
    } else {
    
      this.compra = {
        personaId: this.idPersona,
        direccionId: this.direccion_entrega,
        fecha_hora_compra: this.fecha_hora_compra,
        items: this.items
      };
    }
  
    console.log(this.compra);
  
    this.compraService.addCompra(this.compra).pipe(
      tap(response => {
        console.log("Compra realizada:", response.data);
      }),
      switchMap(response => {
        const compra=response.data
        const idCompra = compra.id;
        const items = response.data.items;
  
        return this.compraService.updateStock(idCompra).pipe(
          tap(() => console.log("Stock actualizado")),
          switchMap(() => from(items).pipe( // sigue este flujo por cada item dentro de la compra
            concatMap((item: any) => {
              const idItem = item.id;
              const mailVendedor=item.producto.persona.mail
              const asuntoVendedor=`Compra del producto ${item.producto.descripcion}`
              const mensaje=`El cliente ${compra.persona.nombre} ${compra.persona.apellido} realizo la compra del producto ${item.producto.descripcion}
              en un total de ${item.cantidad_producto} unidades`
        

              
              return this.seguimientoService.createSeguimiento(idItem, this.idPersona).pipe(
                switchMap((seguimientoResponse: any) => {
                  const seguimiento = seguimientoResponse.data;
                  const localidadId = item.producto.persona.direccion.localidad.id;
  
                  console.log('Id de la localidad:',localidadId)
                  this.mailAsunto = `Compra con código de seguimiento nro: ${seguimiento.codigoSeguimiento}`;
                  this.mailMensaje = `Tu compra fue realizada con éxito. Ingresando el código de seguimiento en el panel de ver seguimientos podrás ver el recorrido de tu pedido
                  del producto ${seguimiento.item.producto.descripcion}.`;
  
                  return this.seguimientoService.searchEmployeeLocalidad(localidadId).pipe(
                    switchMap((empleadoResponse: any) => {
                      const empleado = empleadoResponse.data;
                  console.log('Mail del empleado',empleado.mail)
                      const destinatarioEmpleado = empleado.mail;
                      const asuntoEmpleado = 'Proceso del seguimiento asignado';
                      const mensajeEmpleado = `Hola ${empleado.nombre} se te asignó el proceso de clasificación para el producto ${seguimiento.item.producto.descripcion}. 
                      Cuando termines el proceso, dirigite al panel y seleccioná la próxima localidad a la que debe enviarse el producto para que avance a la siguiente etapa.`;
                  
                     
                      return this.correoService.sendEmail(destinatarioEmpleado, asuntoEmpleado, mensajeEmpleado).pipe(
                        tap(() => console.log(`Correo enviado al empleado: ${destinatarioEmpleado}`)),
                  
                      
                        switchMap(() => this.seguimientoService.createEstado1(seguimiento.id, empleado.id, localidadId)),
                  
                        tap(() => console.log(`Estado creado para seguimiento ${seguimiento.id}`)),
                  
                        // Tercero: enviar correo al cliente
                        switchMap(() => this.correoService.sendEmail(this.mailDestino, this.mailAsunto, this.mailMensaje)),
                  
                        tap(() => console.log(`Correo enviado al cliente: ${this.mailDestino}`)),

                        switchMap(() => this.correoService.sendEmail(mailVendedor, asuntoVendedor, mensaje)),
                  
                        tap(() => console.log(`Correo enviado al vendedor: ${mailVendedor}}`))
                      );
                    })
                  );
                  
                })
              );
            }),
            catchError(err => {
              console.error("Error al procesar un item:", err);
              return of(null);
            })
          ))
        );
      }),
      catchError(err => {
        console.error("Error general del flujo:", err);
        return of(null);
      })
    ).subscribe();
  }
  
loadLocalidades(){
this.seguimientoService.getLocalidades().subscribe({
next:(response:any)=>{
this.localidades=response.data
},error:(error:any)=>{
  console.error('No se encontraron localidades',error)
}



})

}

}    
