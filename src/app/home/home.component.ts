import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeBodyComponent } from '../home-body/home-body.component.js';
import { FooterComponent } from '../footer/footer.component.js';
import { LoginComponent } from '../login/login.component.js';
import { HeaderComponent } from '../header/header.component.js';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet,HomeBodyComponent,FooterComponent,LoginComponent,HeaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
