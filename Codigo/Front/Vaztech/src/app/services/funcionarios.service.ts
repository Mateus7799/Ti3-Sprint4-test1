import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { FuncionarioResponse } from '../models/funcionario.model';

@Injectable({
  providedIn: 'root',
})
export class FuncionariosService {
  http = inject(HttpClient);
  apiRoute = 'api/funcionarios';

  buscarFuncionarios(): Observable<FuncionarioResponse[]> {
    return this.http.get<FuncionarioResponse[]>(`${environment.apiURL}/${this.apiRoute}/cards`);
  }
}
