package br.com.vaztech.vaztech.service.impl;

import br.com.vaztech.vaztech.dto.ProdutoResponseDTO;
import br.com.vaztech.vaztech.dto.ProdutoAddRequestDTO;
import br.com.vaztech.vaztech.dto.ProdutoAddResponseDTO;
import br.com.vaztech.vaztech.dto.ProdutoUpdateRequestDTO;
import br.com.vaztech.vaztech.dto.ProdutoUpdateResponseDTO;
import br.com.vaztech.vaztech.dto.StatusProdutoDTO;
import br.com.vaztech.vaztech.entity.Produto;
import br.com.vaztech.vaztech.entity.StatusProduto;
import br.com.vaztech.vaztech.repository.ProdutoRepository;
import br.com.vaztech.vaztech.repository.StatusProdutoRepository;
import br.com.vaztech.vaztech.service.ProdutoService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProdutoServiceImpl implements ProdutoService {

    private final ProdutoRepository repository;

    private final StatusProdutoRepository statusProdutoRepository;

    @Override
    public ProdutoAddResponseDTO produtoAdd(ProdutoAddRequestDTO dto) throws RuntimeException{
        try {
            Produto produto = new Produto();
            produto.setNumeroSerie(dto.numeroSerie());
            produto.setAparelho(dto.aparelho());
            produto.setModelo(dto.modelo());
            produto.setCor(dto.cor());
            produto.setObservacoes(dto.observacoes());

            StatusProduto status = statusProdutoRepository.findById(dto.status())
                    .orElseThrow(() -> new RuntimeException("Status não encontrado com ID: " + dto.status()));

            produto.setStatus(status);

            repository.save(produto);

            return new ProdutoAddResponseDTO();
        } catch (Exception e) {
            throw new RuntimeException("Erro na criação de produto: " + e.getMessage());
        }
    }

    @Override
    public List<StatusProdutoDTO> listarStatus() {
        return statusProdutoRepository.findAll()
                .stream()
                .map(status -> new StatusProdutoDTO(status.getId(), status.getNome()))
                .toList();
    }

    @Override
    public ProdutoResponseDTO listarProdutosComPaginacao(Pageable pageable) {
        Page<Produto> page = repository.findAll(pageable);
        List<ProdutoResponseDTO.ProdutoItemDTO> items = page.getContent().stream()
                .map(produto -> {
                    Integer statusId = (produto.getStatus() != null)
                            ? produto.getStatus().getId()
                            : null;

                    return new ProdutoResponseDTO.ProdutoItemDTO(
                            produto.getNumeroSerie(),
                            produto.getAparelho(),
                            produto.getModelo(),
                            produto.getObservacoes(),
                            statusId,
                            produto.getCor()
                    );
                })
                .toList();

        ProdutoResponseDTO.PaginacaoMetadataDTO metadata = new ProdutoResponseDTO.PaginacaoMetadataDTO(
                page.getTotalElements(),
                page.getTotalPages(),
                page.getNumber(),
                page.getSize()
        );

        return new ProdutoResponseDTO(items, metadata);
    }

    @Override
    public ProdutoUpdateResponseDTO produtoUpdate(String numeroSerie, ProdutoUpdateRequestDTO dto) throws RuntimeException {
        try {
            Produto produto = repository.findById(numeroSerie)
                    .orElseThrow(() -> new RuntimeException("Produto não encontrado com número de série: " + numeroSerie));

            if (dto.aparelho() != null) {
                produto.setAparelho(dto.aparelho());
            }
            if (dto.modelo() != null) {
                produto.setModelo(dto.modelo());
            }
            if (dto.cor() != null) {
                produto.setCor(dto.cor());
            }
            if (dto.observacoes() != null) {
                produto.setObservacoes(dto.observacoes());
            }
            if (dto.status() != null) {
                StatusProduto status = statusProdutoRepository.findById(dto.status())
                        .orElseThrow(() -> new RuntimeException("Status não encontrado com ID: " + dto.status()));
                produto.setStatus(status);
            }

            Produto produtoAtualizado = repository.save(produto);

            return new ProdutoUpdateResponseDTO(
                    produtoAtualizado.getNumeroSerie(),
                    produtoAtualizado.getAparelho(),
                    produtoAtualizado.getModelo(),
                    produtoAtualizado.getCor(),
                    produtoAtualizado.getObservacoes(),
                    produtoAtualizado.getStatus() != null ? produtoAtualizado.getStatus().getId() : null // <-- ENVIA O ID
            );
        } catch (Exception e) {
            throw new RuntimeException("Erro na atualização do produto: " + e.getMessage());
        }
    }
}