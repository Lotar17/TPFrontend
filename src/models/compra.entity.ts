import { Producto } from "./producto.entity";
import { Persona } from "../app/models/persona.entity";
export interface Compra {
    id?: string;                
    direccion_entrega?: string;  
    producto?: string|Producto;           
    persona?: string;   
    empleado?:string           
    cantidad_producto?: number;   
    fecha_hora_compra?: string;   
    total_compra?:number
       // Descuento aplicado
  }
  