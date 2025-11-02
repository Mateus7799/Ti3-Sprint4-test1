import { Produto } from './produto.model';

export type Operacao = {
  id: number;
  produto: ProdutoOperacao;
  funcionario: FuncionarioOperacao;
  pessoa: PessoaOperacao;
  valor: number;
  tipo: 0 | 1;
  observacoes: string;
  dataHoraTransacao: Date;
};

export type PessoaOperacao = {
  id: number;
  nome: string;
  cpfCnpj: string;
};

export type ProdutoOperacao = {
  id: number;
  numeroSerie: string;
  aparelho: string;
  modelo: string;
};

export type FuncionarioOperacao = {
  id: number;
  nome: string;
};

export type AdicionarOperacaoDTO = {
  numeroSerieProduto: string | null;
  valor: number;
  idPessoa: number;
  idFuncionario: number;
  tipo: 0 | 1;
  observacoes?: string;
  produto?: Produto;
};

export type EditarOperacaoDTO = {
  valor: number;
  tipo: 0 | 1;
  observacoes?: string;
};
