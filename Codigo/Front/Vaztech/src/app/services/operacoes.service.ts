import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import {
  AdicionarOperacaoDTO,
  EditarOperacaoDTO,
  FuncionarioOperacao,
  PessoaOperacao,
  ProdutoOperacao,
} from '../models/operacao.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OperacoesService {
  http = inject(HttpClient);
  apiRoute = 'api/operacao';

  listarOperacoes(tipo: 'compras' | 'vendas') {
    return this.http.get(`${environment.apiURL}/${this.apiRoute}/informativos`);
  }

  adicionarOperacao(operacao: AdicionarOperacaoDTO) {
    return this.http.post(`${environment.apiURL}/${this.apiRoute}`, operacao);
  }

  editarOperacao(operacao: EditarOperacaoDTO, id: number) {
    return this.http.put(`${environment.apiURL}/${this.apiRoute}/${id}`, operacao);
  }

  funcionariosQuery(busca: string): Observable<FuncionarioOperacao[]> {
    return this.http.get<FuncionarioOperacao[]>(
      `${environment.apiURL}/api/funcionario/buscar?query=${busca}`,
    );
  }

  pessoasQuery(busca: string): Observable<PessoaOperacao[]> {
    return this.http.get<PessoaOperacao[]>(
      `${environment.apiURL}/api/pessoa/buscar?query=${busca}`,
    );
  }

  produtosQuery(busca: string): Observable<ProdutoOperacao[]> {
    return this.http.get<ProdutoOperacao[]>(
      `${environment.apiURL}/api/produto/buscar?query=${busca}`,
    );
  }
}
