export interface Compra {
    id?: string;                // ID opcional, generado automáticamente
    direccion_entrega: string;  // Dirección de entrega
    producto: string;           // ID del producto (relacionado con Producto)
    persona: string;            // ID del cliente (por ahora ingresado manualmente)
    cantidad_producto: number;   // Cantidad del producto que se está comprando
    fecha_hora_compra: string;   // Fecha de la compra
    descuento: number;   
    empleado:string       // Descuento aplicado
  }
  