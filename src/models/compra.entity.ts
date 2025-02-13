import { Producto } from "./producto.entity";
import { Persona } from "../app/models/persona.entity";
export interface Compra {
    id?: string;                
    direccion_entrega?: string;  
     items:item_Compra []        
    persona?: string;   
   
    
    fecha_hora_compra?: string;   
    total_compra?:number
       // Descuento aplicado
  }
  export interface item_Compra {
   id?:string
   producto?: string|Producto;                

    cantidad_producto?:number
       // Descuento aplicado
  }
  