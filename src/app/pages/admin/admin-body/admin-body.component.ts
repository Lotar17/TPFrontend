import { Component } from '@angular/core';
import { AdminCardComponent } from '../admin-card/admin-card.component.js';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-body',
  standalone: true,
  imports: [AdminCardComponent, RouterLink],
  templateUrl: './admin-body.component.html',
  styleUrl: './admin-body.component.css',
})
export class AdminBodyComponent {}
