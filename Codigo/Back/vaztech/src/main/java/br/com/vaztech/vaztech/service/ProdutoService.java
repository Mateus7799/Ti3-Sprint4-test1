package br.com.vaztech.vaztech.service;

import br.com.vaztech.vaztech.dto.ProdutoResponseDTO;
import br.com.vaztech.vaztech.dto.ProdutoAddRequestDTO;
import br.com.vaztech.vaztech.dto.ProdutoAddResponseDTO;
import br.com.vaztech.vaztech.dto.ProdutoUpdateRequestDTO;
import br.com.vaztech.vaztech.dto.ProdutoUpdateResponseDTO;
import br.com.vaztech.vaztech.dto.StatusProdutoDTO;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProdutoService {
    public ProdutoAddResponseDTO produtoAdd(ProdutoAddRequestDTO dto) throws RuntimeException;

    public List<StatusProdutoDTO> listarStatus();

    public ProdutoResponseDTO listarProdutosComPaginacao(Pageable pageable);

    public ProdutoUpdateResponseDTO produtoUpdate(String numeroSerie, ProdutoUpdateRequestDTO dto) throws RuntimeException;
}