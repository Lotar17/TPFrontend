import { Persona } from "./persona.entity";
import { Item } from "./item.entity";

export type Compra = {
    id?: string;
    direccion_entrega: string;
    personaId?: string;
    persona?:Persona;
    items?: Item[];  
    fecha_hora_compra: string;
    total_compra?: number;
  };
  