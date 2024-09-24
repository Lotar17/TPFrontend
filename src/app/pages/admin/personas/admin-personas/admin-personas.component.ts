import { Component, inject } from '@angular/core';
import { PersonasService } from '../../../../api/personas.service.js';
import { Observable } from 'rxjs';
import { Persona } from '../../../../models/persona.entity.js';
import { AsyncPipe } from '@angular/common';
import { ApiResponse } from '../../../../models/ApiResponse.js';

@Component({
  selector: 'app-admin-personas',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './admin-personas.component.html',
  styleUrl: './admin-personas.component.css',
})
export class AdminPersonasComponent {
  personaService = inject(PersonasService);

  personas$ = this.personaService.personas$;

  constructor() {
    this.personaService.getAll();
  }

  delete(persona: Persona) {
    this.personaService.deleteOne(persona).subscribe();
  }
}
