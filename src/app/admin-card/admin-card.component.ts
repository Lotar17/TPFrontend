import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-admin-card',
  standalone: true,
  imports: [NgClass],
  templateUrl: './admin-card.component.html',
  styleUrl: './admin-card.component.css',
})
export class AdminCardComponent {
  @Input()
  categoria: string | undefined;

  @Input()
  link: string | undefined;

  @Input()
  color: string | undefined;

  @Input()
  icono: string | undefined;
}
