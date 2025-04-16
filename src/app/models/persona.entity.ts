import { Direccion } from "./direccion.entity";
import { Compra } from "./compra.entity";
import { Producto } from "./producto.entity";
import { EstadoSeguimiento } from "./estado_seguimiento.entity";

export type Persona = {
  id?: string;
  nombre: string;
  apellido: string;
  telefono: string;
  mail: string;
  password?: string;
  rol?: string;
  direccion?:Direccion
  prods_publicados?: Producto[];
  estados_empleados?:EstadoSeguimiento[];
  compras?: Compra[]

};
