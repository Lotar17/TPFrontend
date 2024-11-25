import { Categoria } from './categoria.entity.js';
import { Persona } from './persona.entity.js';
import { PrecioHistorico } from './precioHistorico.entity.js';

export type Producto = {
  id?: string;
  descripcion: string;
  persona?: Persona;
  personaId?: string;
  stock?: number;
  precio: number;
  categoria?: Categoria;
  categoriaId?: string;
  compras?: [];
  hist_precios?: PrecioHistorico[];
};
