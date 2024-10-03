import { Component } from '@angular/core';
import { SearchBarComponent } from '../search-bar/search-bar.component';

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [SearchBarComponent],
  templateUrl: './cliente.component.html',
  styleUrl: './cliente.component.css'
})
export class ClienteComponent {
  client = {
    name: 'Juan Pérez',
    email: 'juan.perez@example.com',
    phone: '+123 456 789',
    address: 'Calle Falsa 123, Ciudad',
    profilePicture: 'https://via.placeholder.com/150',
    joinedDate: '2022-01-15'
  };
}
