import { Component } from '@angular/core';
import { HeaderComponent } from '../../header/header.component.js';
import { AdminBodyComponent } from './admin-body/admin-body.component.js';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [HeaderComponent, AdminBodyComponent, RouterOutlet],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent {}
