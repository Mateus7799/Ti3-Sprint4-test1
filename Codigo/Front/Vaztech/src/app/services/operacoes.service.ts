import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OperacoesService {
  http = inject(HttpClient);

  // EM REFATORAÇÃO
  // editarItemEstoque(item: ItemEstoque) {
  //   return this.http.put(`${environment.apiURL}/${this.apiRoute}/update/${item.numeroDeSerie}`, {
  //     ...item,
  //     status: 'EM ESTOQUE',
  //     dataEntrada: item.dataEntrada.toISOString().slice(0, 10),
  //   });
  // }
}
