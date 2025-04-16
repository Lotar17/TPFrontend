import { Component } from '@angular/core';
import { Direccion } from '../models/direccion.entity';
import { Localidad } from '../models/localidad.entity';
import { ComprasService } from '../api/compra.service';
import { ActivatedRoute, Route } from '@angular/router';
import { ProductosService } from '../api/producto.service';
import { Producto } from '../models/producto.entity';
import { FormGroup,FormControl,ReactiveFormsModule } from '@angular/forms';
import { CarritoService } from '../api/cart.service';
import { Item } from '../models/item.entity';
import { Compra } from '../models/compra.entity';
import { CommonModule } from '@angular/common';
import { AutenticacionService } from '../api/autenticacion.service';
import { concatMap,switchMap,from,catchError,tap,of} from 'rxjs';
import { SeguimientoService } from '../api/seguimiento.service';
import { PersonaService } from '../api/per.service';
import { Persona } from '../models/persona.entity';
import { CorreoService } from '../api/correo.service';
import { map } from 'rxjs';
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
idUser!:string
cliente!:Persona
direcciones: Direccion[] = [];
mostrarNuevaDireccion: boolean = false;
localidades:Localidad[]=[]
compradorDestinatario!:string

  constructor(
    private compraService: ComprasService,
   
    private route:ActivatedRoute,
    private autenticacionService:AutenticacionService,
    private productoService:ProductosService,
    private carritoService:CarritoService,
    private seguimientoService:SeguimientoService,
    private personaService:PersonaService,
    private correoService:CorreoService
  ) {}

  publicaForm = new FormGroup({
    direccion: new FormControl(),
    cantidad_producto: new FormControl(),
    calle: new FormControl(),
    numero: new FormControl(),
    localidad: new FormControl()
  });
  ngOnInit(): void {
    this.loadLocalidades()
    const id = this.route.snapshot.paramMap.get('id'); 
    this.autenticacionService.getUserInformation().subscribe({
      next:(response:any)=>{
      this.idUser=response.data.id
      
if(this.idUser){
  this.personaService.getOne(this.idUser).subscribe({
    next:(response:any)=>{
this.cliente=response.data
if(this.cliente)
  this.compradorDestinatario=this.cliente.mail

if (this.cliente.direccion) {
  this.direcciones.push(this.cliente.direccion);
}
if(this.cliente.compras)
  this.cliente.compras.forEach(compra => {
    if (compra.direccion) {
      this.direcciones.push(compra.direccion);
    }
  });
this. direcciones = this. direcciones.filter((dir, i, self) =>
  i === self.findIndex(d => d.calle === dir.calle && d.numero === d.numero)
);



    },
    error:(error:any)=>{
    
      console.error("No se encontro el usuario",error)
    }
    

  })
}
      },
      error:(error:any)=>{
      
        console.error("No se encontro el usuario",error)
      }})
    
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
  
   
    this.direccion_entrega = this.publicaForm.value.direccion || '';
    this.fecha_hora_compra = new Date().toISOString();
    this.cantidad_producto = this.publicaForm.value.cantidad_producto;
    this.compraExitosa = true;

    if (!this.producto) {
      console.error("❌ Error: El producto no se ha cargado correctamente.");
      return;
    }
    if(this.producto.stock)
    if (this.cantidad_producto <= 0 || this.cantidad_producto > this.producto.stock) {
      console.error("❌ Error: La cantidad debe ser mayor a 0 y menor o igual al stock disponible.");
      this.mostrarNotificacion("❌ Cantidad no válida. Stock disponible: " + this.producto.stock);
      return;
    }
  
    console.log("📌 Producto cargado correctamente:", this.producto);
    console.log("📌 Creando item en el carrito...");
  if(this.producto.id)
    
    this.carritoService.createItem(this.producto.id, this.idUser, this.cantidad_producto).subscribe({
      next: (response: any) => {
        if (!response || !response.data) {
          console.error("❌ Error: La respuesta del servidor no contiene datos del item.");
          return;
        }
  
        console.log("✅ Item creado con éxito:", response.data);
  
     console.log("Hasta aca anda")
        this.items[0]=response.data
  
        console.log("📌 Items actuales:", this.items);
        if (this.mostrarNuevaDireccion) {
          // Se crea con los campos individuales
          this.compra = {
            personaId: this.idUser,
            fecha_hora_compra: this.fecha_hora_compra,
            items: this.items,
            calle: this.publicaForm.value.calle || '',
            numero: this.publicaForm.value.numero || 0,
            localidadId: this.publicaForm.value.localidad || '',
          
          };}
        
        else
        this.compra = {
          personaId: this.idUser,
          direccionId: this.direccion_entrega,
          fecha_hora_compra: this.fecha_hora_compra,
          items: this.items
        };
  
        console.log("📌 Enviando compra al servidor:", this.compra);
  
      
  
        this.compraService.addCompra(this.compra).pipe(
          tap((response: any) => {
            console.log("✅ Compra directa creada:", response);
            this.mostrarNotificacion(`Compra creada con éxito`);
          }),
          switchMap((response: any) => {
            const compra = response.data;
            if (!compra || !compra.id || !compra.items || !compra.items[0]) {
              console.error("❌ Error: Datos incompletos en la compra.");
              return of(null);
            }
        
            const item = compra.items[0];
            const localidadId = item.producto.persona.direccion.localidad.id;
        console.log('Item y localidad',item.id,localidadId)
            // Primero, actualizar el stock
            return this.compraService.updateStock(compra.id).pipe(
              tap(() => console.log("✅ Stock actualizado")),
              // Luego crear el seguimiento
              
              switchMap(() => this.seguimientoService.createSeguimiento(item.id, this.idUser)),
              switchMap((seguimientoResponse: any) => {
                const seguimiento = seguimientoResponse.data;
              
                const mailComprador = this.compradorDestinatario;
                const asuntoComprador = 'Código de seguimiento generado';
                const mensajeComprador = `Hola ${this.cliente.nombre}, se ha generado un nuevo seguimiento para tu producto "${seguimiento.item.producto.descripcion}".
              Tu código de seguimiento es: ${seguimiento.codigoSeguimiento}.
              Podés seguir el estado de tu envío desde tu panel de seguimientos.`;
              
                // Enviar mail al comprador
                return this.correoService.sendEmail(mailComprador, asuntoComprador, mensajeComprador).pipe(
                  tap(() => console.log(`📩 Correo enviado al comprador: ${mailComprador}`)),
                  map(() => seguimiento)
                );
              }),
              switchMap((seguimiento) => {
                return this.seguimientoService.searchEmployeeLocalidad(localidadId).pipe(
                  switchMap((empleadoResponse: any) => {
                    const empleado = empleadoResponse.data;
                    const mailEmpleado = empleado?.mail;
              
                    if (!mailEmpleado || mailEmpleado.trim() === '') {
                      console.error('❌ Correo del empleado no definido');
                     
                    }
              
                    const asuntoEmpleado = 'Procedimiento asignado';
                    const mensajeEmpleado = `Hola ${empleado.nombre}, se te asignó el proceso de clasificación para el producto "${seguimiento.item.producto.descripcion}". 
              Por favor, ingresá al panel y continuá con el procedimiento correspondiente.`;
              
                    // Enviar mail al empleado
                    return this.correoService.sendEmail(mailEmpleado, asuntoEmpleado, mensajeEmpleado).pipe(
                      tap(() => console.log(`📩 Correo enviado al empleado: ${mailEmpleado}`)),
              
                      // Luego crear el estado inicial
                      switchMap(() => {
                        return this.seguimientoService.createEstado1(seguimiento.id, empleado.id, localidadId).pipe(
                          tap(() => console.log(`✅ Estado creado para seguimiento ${seguimiento.id}`))
                        );
                      })
                    );
                  })
                );
              })
              
            );
          }),
          catchError(error => {
            console.error("❌ Error en el flujo de compra directa:", error);
            return of(null);
          })
        ).subscribe();
        
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

  cantidadInvalida: boolean = false;

  validarCantidad() {
    const cantidad = this.publicaForm.value.cantidad_producto;
    if(this.producto.stock)
    this.cantidadInvalida = cantidad <= 0 || cantidad > this.producto.stock;
  }
  
  loadLocalidades(){
    this.seguimientoService.getLocalidades().subscribe({
    next:(response:any)=>{
    this.localidades=response.data
    },error:(error:any)=>{
      console.error('No se encontraron localidades',error)
    }})}

}

