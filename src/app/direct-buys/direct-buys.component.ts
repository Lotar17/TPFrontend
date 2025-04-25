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
import { Router } from '@angular/router';
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
muestraDetalle= false
muestraCompra: Compra|null= null
confirmaCompra=false
stockInvalido=false



  constructor(
    private compraService: ComprasService,
   
    private route:ActivatedRoute,
    private autenticacionService:AutenticacionService,
    private productoService:ProductosService,
    private carritoService:CarritoService,
    private seguimientoService:SeguimientoService,
    private personaService:PersonaService,
    private router:Router
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
    console.log(" Iniciando proceso de compra...");
  
   
    this.direccion_entrega = this.publicaForm.value.direccion || '';
  
    this.cantidad_producto = this.publicaForm.value.cantidad_producto;
    this.compraExitosa = true;

    if (!this.producto) {
      console.error(" Error: El producto no se ha cargado correctamente.");
      return;
    }
    if(this.producto.stock)
    if (this.cantidad_producto <= 0 || this.cantidad_producto > this.producto.stock) {
      console.error(" Error: La cantidad debe ser mayor a 0 y menor o igual al stock disponible.");
     
      return;
    }
  
    console.log(" Producto cargado correctamente:", this.producto);
    console.log(" Creando item en el carrito...");
  if(this.producto.id)
    
    this.carritoService.createItem(this.producto.id, this.idUser, this.cantidad_producto).subscribe({
      next: (response: any) => {
        if (!response || !response.data) {
          console.error("Error: La respuesta del servidor no contiene datos del item.");
          return;
        }
  
        console.log(" Item creado con éxito:", response.data);
  
     console.log("Hasta aca anda")
        this.items[0]=response.data
  
        console.log(" Items actuales:", this.items);
        if (this.mostrarNuevaDireccion) {
          // Se crea con los campos individuales
          this.compra = {
            personaId: this.idUser, 
            items: this.items,
            calle: this.publicaForm.value.calle || '',
            numero: this.publicaForm.value.numero || 0,
            localidadId: this.publicaForm.value.localidad || '',
          
          };}
        
        else
        this.compra = {
          personaId: this.idUser,
          direccionId: this.direccion_entrega,
          items: this.items
        };
  
        console.log(" Enviando compra al servidor:", this.compra);
  
        this.compraService.procesarCompra(this.compra, this.idUser, this.compradorDestinatario)
        .subscribe({
          next: () => {
            console.log("Compra procesada correctamente");
            setTimeout(() => {
              console.log('Llega aca')
              this.router.navigate(['/productos']);
            }, 500);
    
          },
          error: (err) => {
            console.error("Error al procesar la compra:", err);
          }
        });

        
      },
      error: (error) => {
        console.error(" Error al agregar item al carrito:", error);
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
      // Solo muestra el modal si la cantidad es válida
      if (!this.cantidadInvalida) {
        this.confirmaCompra = true;
      }
    }
    
    confirmarYEnviar() { 
      // Muestra cuando se acepta en el modal
      this.cerrarModalConfirmacion(); // Opcional, si quieres cerrar antes
      this.onSubmit();
      this.muestraDetalle = true; 
    }
    
    cerrarModalConfirmacion() {
      // Si la compra no se acepta en el modal
      this.confirmaCompra = false;
    }
    
    cerrarModalDetalle() {
      this.muestraDetalle = false;
    }
    
    mensajeError: string | null = null;
    cantidadInvalida: boolean = false;
    
    validarCantidad() {
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
          this.cerrarError(); // Si la cantidad es válida, ocultamos el error
        }
      }
    }
    
    // Llamar esto cuando ocurra un error
    mostrarError(mensaje: string) {
      this.mensajeError = mensaje;
    }
    
    cerrarError() {
      this.mensajeError = null;
    }
    
    // Aquí adaptamos tu lógica para integrar la validación de cantidades y la confirmación de la compra
    validarYConfirmar() {
      this.validarCantidad(); // Primero valida la cantidad
      
      if (!this.cantidadInvalida) {
        this.confirmarCompra(); // Si la cantidad es válida, muestra el modal de confirmación
      }
    }
  }    