import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component.js';
import { HomeBodyComponent } from './home-body/home-body.component.js';
import { FooterComponent } from './footer/footer.component.js';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,RouterLink, HeaderComponent, HomeBodyComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'tp-frontend';
}
