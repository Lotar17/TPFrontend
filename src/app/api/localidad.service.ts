import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CRUDService } from './crud.service.js';
import { Localidad } from '../models/localidad.entity.js';

@Injectable({
  providedIn: 'root',
})
export class LocalidadService extends CRUDService<Localidad> {
  constructor(http: HttpClient) {
    super(http);
  }
}
