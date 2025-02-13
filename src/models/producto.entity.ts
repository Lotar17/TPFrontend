import { PrecioHistorico } from "../app/models/precioHistorico.entity";
export interface Producto {
    id?: string;
    
    descripcion: string;
   
    stock: number;
    persona?: string

   
  }
  export interface ProductoConCantidad {
    producto: Producto;  
    cantidad: number|undefined;
  }
  