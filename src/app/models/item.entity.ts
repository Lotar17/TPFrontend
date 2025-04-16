import { Persona } from "./persona.entity";
import { Producto } from "./producto.entity";
import { Compra } from "./compra.entity";

export type Item = {
    _id?: string;
    id?:string
    cantidad_producto: number;
    producto?: Producto;
    productoId?:string;  
    persona?: Persona;
    personaId?:string;
    compra?: Compra;
  };
  