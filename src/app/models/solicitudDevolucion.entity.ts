import { Item } from "./item.entity";
import { Persona } from "./persona.entity";

export type Devolucion={
id?:string
item:Item,
compradorId?: string,
comprador?:Persona,
vendedorId?:string
vendedor?:Persona
motivo:string,
estado:string,
codigoConfirmacion:number,
fechaSolicitud:string,
fechaConfirmacion:string,
cantidad_devuelta:number,
fechaCierre?:string
mensajeCierre?:string
fechaEnvioCliente?:string
actualizada?:boolean



}