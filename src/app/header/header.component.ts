import { Component } from '@angular/core';
import { LoginComponent } from '../login/login.component.js';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [LoginComponent,RouterLink,RouterOutlet],
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
