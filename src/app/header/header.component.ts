import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AutenticacionService } from '../api/autenticacion.service.js';
import { SesionPersona } from '../models/sesionPersona.entity.js';
import { AsyncPipe, NgIf } from '@angular/common';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/ApiResponse.js';
;
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, AsyncPipe, NgIf],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  cierreSesion=false
  sesionPersona$!: Observable<ApiResponse<SesionPersona | undefined>>;
  constructor(
    private route: Router,
    private autenticacionService: AutenticacionService,
    private router:Router
  ) {}

  ngOnInit() {
    this.sesionPersona$ = this.autenticacionService.getUserInformation();
  }
  irLogin(path: string): void {
    this.route.navigateByUrl(path);
  }


menuOpen: boolean = false;

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }
  
}
