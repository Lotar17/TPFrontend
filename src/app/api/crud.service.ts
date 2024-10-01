import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiResponse } from '../models/ApiResponse.js';
import { BaseModel } from '../models/baseModel.entity.js';

@Injectable({
  providedIn: 'root',
})
export class CRUDService<T extends BaseModel> {
  private subject = new BehaviorSubject<T[]>([]);
  $ = this.subject.asObservable();

  url = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getAll(tabla: string): void {
    this.http
      .get<ApiResponse<T[]>>(`${this.url}/${tabla}`)
      .subscribe((response) => {
        if (response.data) this.subject.next(response.data);
      });
  }

  deleteOne(tabla: string, t: T): Observable<ApiResponse<T>> {
    return this.http
      .delete<ApiResponse<T>>(`${this.url}/${tabla}/${t.id}`)
      .pipe(
        tap(() => {
          const listaActualizada = this.subject
            .getValue()
            .filter((itemBorrado) => itemBorrado.id !== t.id);
          this.subject.next(listaActualizada); // Emitir nuevo estado
        })
      );
  }

  add(tabla: string, t: T) {
    return this.http
      .post<ApiResponse<T>>(`${this.url}/${tabla}/`, t)
      .subscribe((response) => {
        t.id = response.data?.id;
        this.subject.getValue().push(t);
        const listaActualizada = this.subject.getValue();
        this.subject.next(listaActualizada);
      });
  }

  update(tabla: string, t: T) {
    return this.http
      .put<ApiResponse<T>>(`${this.url}/${tabla}/${t.id}`, t)
      .subscribe((response) => {
        const listaActual = this.subject.getValue();
        const listaActualizada = listaActual.map((itemEditado) =>
          itemEditado.id === response.data?.id ? response.data! : itemEditado
        );
        this.subject.next(listaActualizada);
      });
  }
}
