export type PessoaResponse = {
  id: number;
  nome: string;
  cpfCnpj: string;
  dataNascimento?: Date | string;
  origem: string;
};

export type PessoaAddRequest = {
  nome: string;
  cpfCnpj: string;
  dataNascimento?: string;
  origem: string;
};

export type PessoaUpdateRequest = {
  nome: string;
  cpfCnpj: string;
  dataNascimento?: string;
  origem: string;
};
