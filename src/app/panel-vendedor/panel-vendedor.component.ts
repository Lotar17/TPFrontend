import { Component } from '@angular/core';
import { AuthService } from '../api/Auth.service';
import { ProductosService } from '../api/producto.service';
import { Persona } from '../models/persona.entity';
import { Producto } from '../models/producto.entity';
import { CRUDService } from '../api/crud.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-panel-vendedor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './panel-vendedor.component.html',
  styleUrl: './panel-vendedor.component.css'
})
export class PanelVendedorComponent {
productos:Producto[]=[]
idUser!:string
user?:Persona
constructor(
private crudService:CRUDService<Persona>,
private authService:AuthService
){}

ngOnInit(){
this.idUser= this.authService.getUserId()// debo usar autenticacion


this.user= this.crudService.getOne('personas', this.idUser)
if (this.user){
  if(this.user.prods_publicados)
this.productos=this.user.prods_publicados

}
else {
  this.productos=[]
}

}

}
