import { Component } from '@angular/core';
import { SeguimientoService } from '../../api/seguimiento.service';
import { AutenticacionService } from '../../api/autenticacion.service';
import { EstadoSeguimiento } from '../../models/estado_seguimiento.entity';
import { response } from 'express';
import { error } from 'console';
import { Persona } from '../../models/persona.entity';
import { CommonModule } from '@angular/common';
import { Localidad } from '../../models/localidad.entity';
import { ReactiveFormsModule, FormGroup,FormControl} from '@angular/forms';
import { CorreoService } from '../../api/correo.service';
@Component({
  selector: 'app-panel-empleado-segumiento',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './panel-empleado-segumiento.component.html',
  styleUrl: './panel-empleado-segumiento.component.css'
})
export class PanelEmpleadoSegumientoComponent {
  estadosSeguimiento:EstadoSeguimiento[]=[]
  idEmpleado!:string
  localidades!:Localidad[]
  empleado!:Persona

  localidadForm= new FormGroup({
localidad: new FormControl()

})

  constructor(private autenticacionService:AutenticacionService,
    private seguimientoService:SeguimientoService,
    private correoService:CorreoService
  )
  {}
ngOnInit(){
this.autenticacionService.getUserInformation().subscribe({
next:(response:any)=>{
  this.idEmpleado=response.data.id
  if(this.idEmpleado){
this.seguimientoService.getEmployeEstado(this.idEmpleado).subscribe({

next:(response:any)=>{
this.estadosSeguimiento=response.data.estados_empleados
this.seguimientoService.getLocalidades().subscribe({
  next:(response:any)=>{
this.localidades=response.data
console.log('Localidades',this.localidades)
  },
  error:(error:any)=>{
  
    console.error("No se encontraron localidades",error)
  }
  
})
}, error:(error:any)=>{
  console.error('No se encontraron los estados del empleado',error)
}})  }

}, error:(error:any)=>{
  console.error('No se encontro el usuario ',error)
}})}
cerrarProceso(idEstado: string) {
  const localidad = this.localidadForm.value.localidad;
  console.log('Localidad seleccionada:', localidad);

  this.seguimientoService.updateEstadoSeguimiento(idEstado, "Cerrado").subscribe({
    next: (response: any) => {
      const estado = response.data;
      console.log('Estado cerrado con éxito:', estado);

      this.seguimientoService.searchEmployeeLocalidad(localidad).subscribe({
        next: (empleadoResponse) => {
          this.empleado = empleadoResponse.data;

          if (this.empleado?.id) {
            this.seguimientoService.createEstado1(estado.seguimiento, this.empleado.id, localidad).subscribe({
              next: (nuevoEstadoResponse) => {
                console.log('Nuevo estado creado con éxito:', nuevoEstadoResponse.data);
const estadoNuevo=nuevoEstadoResponse.data
                const destinatario = this.empleado.mail;
                const asunto = `Asignación proceso ${estadoNuevo.estado}`;
                const mensaje = `Hola ${this.empleado.nombre}, se te asignó el proceso correspondiente.`;

                this.correoService.sendEmail(destinatario, asunto, mensaje).subscribe({
                  next: () => {
                    console.log('Correo enviado con éxito a:', destinatario);
                  },
                  error: (error: any) => {
                    console.error("❌ No se pudo enviar el correo:", error);
                  }
                });

                if (estadoNuevo.estado === 'Cerrado') {
                  const seguimiento = estadoNuevo.seguimiento;
                  const producto = seguimiento?.item?.producto;
                  const vendedorEmail = producto?.persona?.mail;
                  const compradorEmail = seguimiento?.item?.persona?.mail;
                  const nombreProducto = producto?.descripcion ?? 'el producto';

                  if (vendedorEmail) {
                    this.correoService.sendEmail(
                      vendedorEmail,
                      'Producto entregado',
                      `Hola, te informamos que ${nombreProducto} ha sido entregado correctamente al cliente.`
                    ).subscribe({
                      next: () => console.log('📤 Correo enviado al vendedor:', vendedorEmail),
                      error: (err) => console.error('❌ Error al enviar correo al vendedor:', err)
                    });
                  }

                  if (compradorEmail) {
                    this.correoService.sendEmail(
                      compradorEmail,
                      'Tu pedido ha llegado',
                      `Hola, te informamos que ${nombreProducto} llegó correctamente a destino. ¡Gracias por tu compra!`
                    ).subscribe({
                      next: () => console.log('📤 Correo enviado al cliente:', compradorEmail),
                      error: (err) => console.error('❌ Error al enviar correo al cliente:', err)
                    });
                  }
                }
              },
              error: (error) => {
                console.error('❌ No se pudo crear el nuevo estado:', error);
              }
            });
          } else {
            console.error('❌ No se encontró un empleado válido en la localidad');
          }
        },
        error: (error) => {
          console.error("❌ No se encontró el empleado de dicha localidad:", error);
        }
      });
    },
    error: (error: any) => {
      console.error("❌ No se pudo actualizar el estado:", error);
    }
  });
}


}
