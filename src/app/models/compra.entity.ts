import { Persona } from "./persona.entity";
import { Item } from "./item.entity";
import { Direccion } from "./direccion.entity";
import { Localidad } from "./localidad.entity";

export type Compra = {
    id?: string;
    direccionId?: string;
    direccion?:Direccion
    personaId?: string;
    persona?:Persona;
    items?: Item[];  
    fecha_hora_compra?: string;
    total_compra?: number;
    calle?:string,
    numero?:number,
    localidadId?:string
    localidad?:Localidad
  };
  