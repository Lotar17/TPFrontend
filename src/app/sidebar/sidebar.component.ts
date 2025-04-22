import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { AutenticacionService } from '../api/autenticacion.service';
import { CommonModule } from '@angular/common';
import { Input } from '@angular/core';

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



  constructor(
    private router: Router,
    private autenticacionService:AutenticacionService
  ) {}



  verCarrito() {

    this.router.navigate(['/carrito', this.personaId])
     }

     toggleSidebar() {
      this.sidebarVisible = !this.sidebarVisible;
    }
}
