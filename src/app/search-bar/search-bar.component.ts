import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {
  searchTerm: string = '';

  // Emite un evento con el término de búsqueda
  @Output() searchEvent = new EventEmitter<string>();

  onSearch() {
    // Emitimos el término de búsqueda cuando se hace clic en el botón
    this.searchEvent.emit(this.searchTerm);
  }
}
