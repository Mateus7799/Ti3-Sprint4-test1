// export type ItemEstoqueStatus = 'EM ESTOQUE' | 'VENDIDO' | 'ATENÇÃO';

export type ProdutoStatus = {
  id: number;
  nome: string;
};

export type Produto = {
  numeroSerie: string;
  aparelho: string;
  modelo?: string;
  observacoes?: string;
  status?: number;
  cor?: string;
};

export type ProdutosReqDTO = {
  items: Produto[];
  metadata: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
};
