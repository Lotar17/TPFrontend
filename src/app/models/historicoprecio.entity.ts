import { Producto } from "./producto.entity";
export type HistoricoPrecio = {
    id?: string;
    valor: number;
    fechaDesde:Date;
    idProducto?:string
    producto?:Producto

}
