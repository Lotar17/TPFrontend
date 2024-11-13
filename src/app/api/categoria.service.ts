import { Injectable } from '@angular/core';
import { CRUDService } from './crud.service.js';
import { Categoria } from '../models/categoria.entity.js';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService extends CRUDService<Categoria> {
  constructor(http: HttpClient) {
    super(http);
  }
}
