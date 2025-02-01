import { PrecioHistorico } from "../app/models/precioHistorico.entity";
export interface Producto {
    id?: string;
    nombre: string;
    descripcion: string;
    precio: number|undefined;
    stock: number;
    persona?: string

   
  }
