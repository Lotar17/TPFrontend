import { Component, inject } from '@angular/core';
import { PersonasService } from '../../../../api/personas.service.js';
import { Observable } from 'rxjs';
import { Persona } from '../../../../models/persona.entity.js';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-admin-personas',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './admin-personas.component.html',
  styleUrl: './admin-personas.component.css',
})
export class AdminPersonasComponent {
  personaService = inject(PersonasService);

  personas: Persona[] | undefined = [];

  constructor() {
    this.personaService.getAll().subscribe({
      next: (json) => {
        this.personas = json.data;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
