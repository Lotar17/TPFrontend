import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Input } from '@angular/core';
import { PersonaService } from '../api/per.service';
import { Persona } from '../models/persona.entity';
import { LoginService } from '../api/login.service';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @Input() personaId!: string;
  sidebarVisible = false;
user!:Persona
cierreSesion=false


  constructor(
    private router: Router,
    private personaService:PersonaService,
    private loginService:LoginService
  ) {}

ngOnInit(){
  this.personaService.getOne(this.personaId).subscribe({
    next:(response:any)=>{
this.user=response.data
console.log('Datos del usuario cargados:', this.user); 
    },
    error:(error:any)=>{
    
      console.error("No se encontro el usuario",error)
    }
  })
}

  verCarrito() {

    this.router.navigate(['/carrito', this.personaId])
     }

     toggleSidebar() {
      this.sidebarVisible = !this.sidebarVisible;
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
