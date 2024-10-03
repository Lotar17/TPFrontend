import { Persona } from './persona.entity.js';

export type Producto = {
  id?: string;
  descripcion: string;
  stock: number;
  categoria: string;
  persona?: Persona;
};
