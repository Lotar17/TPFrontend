import { Producto } from './producto.entity.js';

export type PrecioHistorico = {
  valor: number;
  fechaDesde?: Date;
  producto?: Producto;
  productoId?: string;
};
