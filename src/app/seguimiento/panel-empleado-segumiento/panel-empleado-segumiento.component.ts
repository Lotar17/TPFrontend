import { Component } from '@angular/core';
import { SeguimientoService } from '../../api/seguimiento.service';
import { AutenticacionService } from '../../api/autenticacion.service';
import { EstadoSeguimiento } from '../../models/estado_seguimiento.entity';
import { Persona } from '../../models/persona.entity';
import { CommonModule } from '@angular/common';
import { Localidad } from '../../models/localidad.entity';
import { ReactiveFormsModule, FormGroup,FormControl,FormBuilder} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SidebarComponent } from "../../sidebar/sidebar.component";
import { LoginService } from '../../api/login.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-panel-empleado-segumiento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, SidebarComponent],
  templateUrl: './panel-empleado-segumiento.component.html',
  styleUrl: './panel-empleado-segumiento.component.css'
})
export class PanelEmpleadoSegumientoComponent {
  estadosSeguimiento:EstadoSeguimiento[]=[]
  idEmpleado!:string
  localidades!:Localidad[]
  empleado!:Persona
  estadoSeguimiento:EstadoSeguimiento|null=null
  estadosClasificacion: EstadoSeguimiento[] = [];
  estadosDistribucion: EstadoSeguimiento[] = [];
  estadosEnCamino: EstadoSeguimiento[] = [];
  estadosCerrados: EstadoSeguimiento[] = [];
  mostrarModalConfirmacion:boolean=false
mostrarExito:boolean=false
modalDetalle:boolean=false
detalleSeleccionado:EstadoSeguimiento|null= null
horaDetalle: string = '';
cierreSesion=false
botonCierre=false
mensajeError: string = '';


  meses = [
    { nombre: 'Enero', valor: '01' },
    { nombre: 'Febrero', valor: '02' },
    { nombre: 'Marzo', valor: '03' },
    { nombre: 'Abril', valor: '04' },
    { nombre: 'Mayo', valor: '05' },
    { nombre: 'Junio', valor: '06' },
    { nombre: 'Julio', valor: '07' },
    { nombre: 'Agosto', valor: '08' },
    { nombre: 'Septiembre', valor: '09' },
    { nombre: 'Octubre', valor: '10' },
    { nombre: 'Noviembre', valor: '11' },
    { nombre: 'Diciembre', valor: '12' },
  ];

  localidadForm= new FormGroup({
localidad: new FormControl()

})
formulariosLocalidad: { [id: string]: FormGroup } = {};


filtroForm = new FormGroup({
  tipo: new FormControl(''),     // 'mes' o 'cliente'
  cliente: new FormControl(''),
  mes: new FormControl(''),
});


  constructor(private autenticacionService:AutenticacionService,
    private seguimientoService:SeguimientoService,
    private loginService:LoginService,
    private router:Router,
    private fb:FormBuilder
  
  )
  {}
  ngOnInit() {
    this.autenticacionService.getUserInformation().subscribe({
      next: (response: any) => {
        this.idEmpleado = response.data?.id;
        if (!this.idEmpleado) {
          console.warn('No se obtuvo ID del empleado');
          return;
        }

        this.cargarEstadosEmpleado(this.idEmpleado);
        this.cargarLocalidades();
      },
      error: (error) => {
        console.error('No se encontró el usuario', error);
      }
    });
    this.filtroForm.valueChanges.subscribe(() => {
      this.aplicarFiltros();
    });
  }

  
  cerrarProceso(estado: EstadoSeguimiento) {

  let localidad:string
    if(estado.estado!== 'En camino'){
     localidad = this.formulariosLocalidad[estado.id]?.get('localidad')?.value;}
    else{
localidad=estado?.seguimiento?.item?.compra?.direccion?.localidad?.id ?? '' // si el estado es 'En camino' asigne la localidad de la compra
    }
  
    console.log('Localidad seleccionada:', localidad);
  
   
    if (localidad) {
      this.seguimientoService.procesarCierreEstado(estado, localidad).subscribe({
        next: () => {
          console.log('Llega ACA3');
          estado.botonCierreVisible = false; // ocultar solo el botón de este estado
          this.mostrarExito = true;
          setTimeout(() => {
            this.mostrarExito = false;
          }, 3000);
        },
        error: (err) => {
          console.error('Error al cerrar proceso:', err);
        }
      });
    } else {
      console.log('No se seleccionó localidad');
      this.mensajeError = 'Debe seleccionar una localidad para cerrar este estado.';
    }
  }
  
  
  cargarEstadosEmpleado(idEmpleado: string) {
    this.seguimientoService.getEmployeEstado(idEmpleado).subscribe({
      next: (response: any) => {
        this.estadosSeguimiento = response.data.estados_empleados.map((estado: any) => {
          // Crear un formulario por estado con localidad inicializada en null
          this.formulariosLocalidad[estado.id] = this.fb.group({
            localidad: [null] // Asegúrate de que sea null al inicio
          });
  
          // Agregar propiedad auxiliar para mostrar el botón de cierre
          return {
            ...estado,
            botonCierreVisible: true
          };
        });
  
        // Filtrar los estados según el estado
        this.estadosClasificacion = this.estadosSeguimiento.filter(e => e.estado === 'En Clasificacion');
        this.estadosDistribucion = this.estadosSeguimiento.filter(e => e.estado === 'En centro de distribución');
        this.estadosEnCamino = this.estadosSeguimiento.filter(e => e.estado === 'En camino');
        this.estadosCerrados = this.estadosSeguimiento.filter(e => e.estado === 'Cerrado');
      },
      error: (error) => {
        console.error('No se encontraron los estados del empleado', error);
      }
    });
  }
  
cargarLocalidades() {
  this.seguimientoService.getLocalidades().subscribe({
    next: (response: any) => {
      this.localidades = response.data ?? [];
    },
    error: (error) => {
      console.error('No se encontraron localidades', error);
    }
  });
}

aplicarFiltros() {
  const tipo = this.filtroForm.value.tipo;
  const mes = this.filtroForm.value.mes;
  const cliente = this.filtroForm.value.cliente?.toLowerCase() || '';

  let filtrados = [...this.estadosSeguimiento];

  if (tipo === 'mes' && mes) {
    filtrados = filtrados.filter(e => {
      const fecha = new Date(e.fecha);
      const [filtroAnio, filtroMes] = mes.split('-');
      return (
        fecha.getMonth() + 1 === parseInt(filtroMes) &&
        fecha.getFullYear() === parseInt(filtroAnio)
      );
    });
  }

  if (tipo === 'cliente' && cliente) {
    filtrados = filtrados.filter(e => {
      const nombre = `${e.seguimiento?.cliente?.nombre ?? ''} ${e.seguimiento?.cliente?.apellido ?? ''}`.toLowerCase();
      return nombre.includes(cliente);
    });
  }

  this.estadosClasificacion = filtrados.filter(e => e.estado === 'En Clasificacion');
  this.estadosDistribucion = filtrados.filter(e => e.estado === 'En centro de distribución');
  this.estadosEnCamino = filtrados.filter(e => e.estado === 'En camino');
  this.estadosCerrados = filtrados.filter(e => e.estado === 'Cerrado');
}
confirmaProceso(estado:EstadoSeguimiento){
  this.mostrarModalConfirmacion= true
  this. estadoSeguimiento=estado

}
confirmarCierreEstado() {
  if(this.estadoSeguimiento)
  this.cerrarProceso(this.estadoSeguimiento)
this.botonCierre=true
this.mostrarModalConfirmacion=false


}

cancelarCierre() {
  this.mostrarModalConfirmacion = false;
  this.estadoSeguimiento=null
  this.mostrarExito=false
}
abrirModalDetalle(estado: any): void {
  this.detalleSeleccionado = estado;
  this.horaDetalle = new Date().toLocaleTimeString(); // Guarda la hora actual
  this.modalDetalle = true;
}

cerrarModalDetalle(): void {
  this.modalDetalle = false;
  this.detalleSeleccionado = null;
}
cerrarSesion() {
  this.loginService.Deslogueo().subscribe({
    next: (response: any) => {
      console.log('Usuario deslogueado con éxito', response.data);
      this.router.navigate(['/login']);
    },
    error: (error: any) => {
      console.error("No se realizó el deslogueo", error);
     
    }
  });
}
abrirModalCierreSesion(){
  this.cierreSesion=true
}
confirmaCierre(){
  this.cerrarSesion();
  this.cierreSesion=false

}

}



