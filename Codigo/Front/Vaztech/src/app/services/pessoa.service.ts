import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { PessoaResponse, PessoaAddRequest, PessoaUpdateRequest } from '../models/pessoa.model';

@Injectable({
  providedIn: 'root',
})
export class PessoaService {
  http = inject(HttpClient);
  apiRoute = 'api/pessoas';

  buscarPessoas(): Observable<PessoaResponse[]> {
    return this.http.get<PessoaResponse[]>(`${environment.apiURL}/${this.apiRoute}`);
  }

  buscarPessoaPorId(id: number): Observable<PessoaResponse> {
    return this.http.get<PessoaResponse>(`${environment.apiURL}/${this.apiRoute}/${id}`);
  }

  criarPessoa(pessoa: PessoaAddRequest): Observable<PessoaResponse> {
    return this.http.post<PessoaResponse>(`${environment.apiURL}/${this.apiRoute}`, pessoa);
  }

  atualizarPessoa(id: number, pessoa: PessoaUpdateRequest): Observable<PessoaResponse> {
    return this.http.put<PessoaResponse>(`${environment.apiURL}/${this.apiRoute}/${id}`, pessoa);
  }

  excluirPessoa(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiURL}/${this.apiRoute}/${id}`);
  }
}
