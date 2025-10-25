export type FuncionarioResponse = {
  id: number;
  codFuncionario: string;
  nome: string;
  dataNascimento: Date | string;
  status: number;
  cpfCnpj: string;
};

export type FuncionarioAddRequest = {
  codFuncionario: string;
  nome: string;
  cpfCnpj: string;
  dataNascimento: string;
  status: number;
};

export type FuncionarioUpdateRequest = {
  codFuncionario: string;
  nome: string;
  cpfCnpj: string;
  dataNascimento: string;
  status: number;
};
