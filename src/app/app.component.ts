import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component.js';
import { HomeBodyComponent } from './home-body/home-body.component.js';
import { FooterComponent } from './footer/footer.component.js';
import { AutenticacionService } from './api/autenticacion.service.js';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    HeaderComponent,
    HomeBodyComponent,
    FooterComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  constructor(private autenticacionService: AutenticacionService) {}

  ngOnInit() {
    this.autenticacionService.getUserInformation();
    console.log('APP COMPONENT');
  }
}
