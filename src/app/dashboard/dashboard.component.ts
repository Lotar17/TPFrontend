import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component.js';
import { FooterComponent } from '../footer/footer.component.js';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HeaderComponent,FooterComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
