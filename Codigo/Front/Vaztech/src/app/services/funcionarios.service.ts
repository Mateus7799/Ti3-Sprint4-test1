import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { FuncionarioResponse, FuncionarioAddRequest, FuncionarioUpdateRequest } from '../models/funcionario.model';

@Injectable({
  providedIn: 'root',
})
export class FuncionariosService {
  http = inject(HttpClient);
  apiRoute = 'api/funcionarios';

  buscarFuncionarios(): Observable<FuncionarioResponse[]> {
    return this.http.get<FuncionarioResponse[]>(`${environment.apiURL}/${this.apiRoute}/cards`);
  }

  buscarFuncionarioPorId(id: number): Observable<FuncionarioResponse> {
    return this.http.get<FuncionarioResponse>(`${environment.apiURL}/${this.apiRoute}/${id}`);
  }

  criarFuncionario(funcionario: FuncionarioAddRequest): Observable<FuncionarioResponse> {
    return this.http.post<FuncionarioResponse>(`${environment.apiURL}/${this.apiRoute}`, funcionario);
  }

  atualizarFuncionario(id: number, funcionario: FuncionarioUpdateRequest): Observable<FuncionarioResponse> {
    return this.http.put<FuncionarioResponse>(`${environment.apiURL}/${this.apiRoute}/${id}`, funcionario);
  }

  excluirFuncionario(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiURL}/${this.apiRoute}/${id}`);
  }
}
