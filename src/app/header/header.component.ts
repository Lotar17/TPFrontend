import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AutenticacionService } from '../api/autenticacion.service.js';
import { SesionPersona } from '../models/sesionPersona.entity.js';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, AsyncPipe, NgIf],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  sesionPersona$ = this.autenticacionService.$;
  constructor(
    private route: Router,
    private autenticacionService: AutenticacionService
  ) {}

  ngOnInit() {
    this.autenticacionService.getUserInformation();
    console.log(`Persona ${JSON.stringify(this.sesionPersona$)}`);
  }
  irLogin(path: string): void {
    this.route.navigateByUrl(path);
  }
}
