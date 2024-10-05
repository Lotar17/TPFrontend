
export type Producto = {
    id?: string;
    descripcion: string;
    persona: string; // ID de la persona que carga el producto
    stock?: number;
    precio:number;
    categoriaNombre: string; // Nombre de la categoría en lugar del ID
    compras?: [];
    hist_precios?: [];
}
