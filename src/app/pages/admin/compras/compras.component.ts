import { Component } from '@angular/core';
import { Compra } from '../../../models/compra.entity.js';
import { CRUDService } from '../../../api/crud.service.js';
import { AsyncPipe, CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-compras',
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe, DatePipe],
  templateUrl: './compras.component.html',
  styleUrl: './compras.component.css',
})
export class ComprasComponent {
  compras$ = this.crudService.$;

  constructor(private crudService: CRUDService<Compra>) {
    this.crudService.getAll('compras');
  }
}
