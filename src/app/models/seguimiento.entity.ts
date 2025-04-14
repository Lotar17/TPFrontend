import { Compra } from "./compra.entity"
import { EstadoSeguimiento } from "./estado_seguimiento.entity"
import { Item } from "./item.entity"
import { Persona } from "./persona.entity"

export type Seguimiento={
id?:string
codigoSeguimiento:number,
calificacionServicio:number,
estados:EstadoSeguimiento[]
item:Item
cliente?:Persona
clienteId?:string

}