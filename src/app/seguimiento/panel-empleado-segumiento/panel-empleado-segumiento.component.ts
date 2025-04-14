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

  localidadForm= new FormGroup({
localidad: new FormControl()

})

  constructor(private autenticacionService:AutenticacionService,
    private seguimientoService:SeguimientoService
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

cerrarProceso(idEstado:string){
  const localidad= this.localidadForm.value.localidad
  console.log('Localidad',localidad)
this.seguimientoService.updateEstadoSeguimiento(idEstado,"Cerrado").subscribe({
  next:(response:any)=>{
    const estado=response.data
    console.log('Estado',estado.seguimiento)
console.log('Estado Cerrado con exito',response.data)
this.seguimientoService.searchEmployeeLocalidad(localidad).subscribe({
  next:(response)=>{
const empleado= response.data
console.log('empleado',empleado)
if(empleado.id)
this.seguimientoService.createEstado1(estado.seguimiento,empleado.id,localidad).subscribe({

  next:(response)=>{
console.log('Estado creado con exito',response.data)
  },
  error:(error)=>{
    console.error('no se creo el estado',error)
  }
})
  },
  error:(error)=>{
  
    console.error("No se encontro el empleado de dicha localidad",error)
  }
  })
  },
  error:(error:any)=>{
  
    console.error("No se actualizo el estado",error)
  }
  })


}

}
