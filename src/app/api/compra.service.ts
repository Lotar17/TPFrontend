import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/ApiResponse';
import { Compra } from '../models/compra.entity';
import { Item } from '../models/item.entity';
import { SeguimientoService } from './seguimiento.service';
import { CorreoService } from './correo.service';
import { tap,switchMap,catchError,pipe,from,concatMap,of } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ComprasService {
  private url: string = 'http://localhost:3000/api/compras'; 
  private url2: string= 'http://localhost:3000/api/compras/persona';
  private url3: string= 'http://localhost:3000/api/compras/stock'
  private item_compra: Item[] = [];
  private item_devolucion: Item[] = [];
  private compra!:Compra
  constructor(private http: HttpClient,
    private seguimientoService:SeguimientoService,
    private correoService:CorreoService
    
  ) {}

  
  addCompra(compra: Compra): Observable<any> {
    return this.http.post(`${this.url}`,compra);


    
  }
  // Método para obtener todas las compras
  getAll(): Observable<ApiResponse<Compra[]>> {
    return this.http.get<ApiResponse<Compra[]>>(this.url);
  }

  // Método para obtener una compra por ID
  getOne(id: string): Observable<ApiResponse<Compra>> {
    return this.http.get<ApiResponse<Compra>>(`${this.url}/${id}`);
  }

  // Método para actualizar una compra
  update(compra:Compra): Observable<ApiResponse<Compra>> {
    return this.http.put<ApiResponse<Compra>>(`${this.url}/${compra.id}`, compra);
  }

  // Método para eliminar una compra
  delete(id: string): Observable<ApiResponse<Compra>> {
    return this.http.delete<ApiResponse<Compra>>(`${this.url}/${id}`);
  }
  getcomprasByUser(idUser: string): Observable<ApiResponse<Compra>> {
    return this.http.get<ApiResponse<Compra>>(`${this.url2}/${idUser}`);
  }

  setItem(items:Item[]){
this.item_compra=items

  }
  getItems(): Item[] {
    return this.item_compra;
  }
setDevolucion(itemDevolucion:Item){
  this.item_devolucion
}
getItemsDevolucion(){
  return this.item_devolucion
}

updateStock(id: string): Observable<ApiResponse<Compra>> {
  return this.http.put<ApiResponse<Compra>>(`${this.url3}/${id}`, null, { responseType: 'json' });
}
setCompra(compra:Compra){
  this.compra=compra
}
getCompra(){
  return this.compra
}
procesarCompra(compra: Compra, idPersona: string, mailDestino: string):Observable<any> {
  return this.addCompra(compra).pipe(
    tap(response => {
      console.log("Compra realizada:", response.data);
    }),
    switchMap(response => {
      const compra = response.data;
      const idCompra = compra.id;
      const items = compra.items;

      return this.updateStock(idCompra).pipe(
        tap(() => console.log("Stock actualizado")),
        switchMap(() => from(items).pipe(
          concatMap((item: any) => {
            const idItem = item.id;
            const mailVendedor = item.producto.persona.mail;
            const asuntoVendedor = `Compra del producto ${item.producto.descripcion}`;
            const mensajeVendedor = `El cliente ${compra.persona.nombre} ${compra.persona.apellido} realizó la compra del producto ${item.producto.descripcion}
            en un total de ${item.cantidad_producto} unidades`;

            return this.seguimientoService.createSeguimiento(idItem, idPersona).pipe(
              switchMap((seguimientoResponse: any) => {
                const seguimiento = seguimientoResponse.data;
                const localidadId = item.producto.persona.direccion.localidad.id;// Localidad del vendedor

                const asuntoCliente = `Compra con código de seguimiento nro: ${seguimiento.codigoSeguimiento}`;
                const mensajeCliente = `Tu compra fue realizada con éxito. Ingresando el código de seguimiento en el panel de ver seguimientos podrás ver el recorrido de tu pedido
                del producto ${seguimiento.item.producto.descripcion}.`;

                return this.seguimientoService.searchEmployeeLocalidad(localidadId).pipe( // se busca un empleado dentro de la localidad del vendedor
                  switchMap((empleadoResponse: any) => {
                    const empleado = empleadoResponse.data;
                    const destinatarioEmpleado = empleado.mail;
                    const asuntoEmpleado = 'Proceso del seguimiento asignado';
                    const mensajeEmpleado = `Hola ${empleado.nombre}, se te asignó el proceso de clasificación para el producto ${seguimiento.item.producto.descripcion}. 
                    Cuando termines el proceso, dirigite al panel y seleccioná la próxima localidad a la que debe enviarse el producto para que avance a la siguiente etapa.`;

                    return this.correoService.sendEmail(destinatarioEmpleado, asuntoEmpleado, mensajeEmpleado).pipe(
                      tap(() => console.log(`Correo enviado al empleado: ${destinatarioEmpleado}`)),

                      switchMap(() => this.seguimientoService.createEstado1(seguimiento.id, empleado.id, localidadId)),

                      tap(() => console.log(`Estado creado para seguimiento ${seguimiento.id}`)),

                      switchMap(() => this.correoService.sendEmail(mailDestino, asuntoCliente, mensajeCliente)),
                      tap(() => console.log(`Correo enviado al cliente: ${mailDestino}`)),

                      switchMap(() => this.correoService.sendEmail(mailVendedor, asuntoVendedor, mensajeVendedor)),
                      tap(() => console.log(`Correo enviado al vendedor: ${mailVendedor}`))
                    );
                  })
                );
              })
            );
          }),
          catchError(err => {
            console.error("Error al procesar un item:", err);
            return of(null);
          })
        ))
      );
    }),
    catchError(err => {
      console.error("Error general del flujo:", err);
      return of(null);
    })
  );
}



}





