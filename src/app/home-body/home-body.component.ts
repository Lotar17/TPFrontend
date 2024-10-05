import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home-body',
  standalone: true,
  imports: [NgOptimizedImage,RouterLink,RouterOutlet],
  templateUrl: './home-body.component.html',
  styleUrl: './home-body.component.css',
})
export class HomeBodyComponent {}
