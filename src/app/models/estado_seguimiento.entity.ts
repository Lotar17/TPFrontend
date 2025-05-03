import { Persona } from "./persona.entity";
import { Seguimiento } from "./seguimiento.entity";
import { Localidad } from "./localidad.entity";

export type EstadoSeguimiento={
id:string
condicion:string
estado:string
fecha:string
empleado?:Persona
idEMpleado?:string
seguimiento?:Seguimiento
idSeguimiento?:string
localidad?:Localidad
idLocalidad?:string
botonCierreVisible?:boolean

}