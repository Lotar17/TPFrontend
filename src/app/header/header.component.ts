import { Component } from '@angular/core';
import { LoginComponent } from '../login/login.component.js';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { RegisterComponent } from '../register/register.component.js';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [LoginComponent,RegisterComponent,RouterLink,RouterOutlet],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(private route:Router){
  }
  irLogin(path:string):void{
    this.route.navigateByUrl(path)
  }
}
