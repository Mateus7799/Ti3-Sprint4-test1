package br.com.vaztech.vaztech.service;

import br.com.vaztech.vaztech.dto.*;
import br.com.vaztech.vaztech.entity.Produto;
import br.com.vaztech.vaztech.entity.StatusProduto;
import br.com.vaztech.vaztech.repository.ProdutoRepository;
import br.com.vaztech.vaztech.repository.StatusProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@Service
public class ProdutoService {

    @Autowired
    ProdutoRepository repository;

    @Autowired
    StatusProdutoRepository statusProdutoRepository;

    public ProdutoResponseDTO produtoAdd(ProdutoAddRequestDTO dto) throws ResponseStatusException {
        try {
            if (repository.existsByNumeroSerie(dto.numeroSerie())) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Número de série já cadastrado.");
            }

            Produto produto = new Produto();
            produto.setNumeroSerie(dto.numeroSerie());
            produto.setAparelho(dto.aparelho());
            produto.setModelo(dto.modelo());
            produto.setCor(dto.cor());
            produto.setObservacoes(dto.observacoes());

            StatusProduto status = statusProdutoRepository.findById(dto.status())
                    .orElseThrow(() ->  new ResponseStatusException(HttpStatus.NOT_FOUND, "Status não encontrado com ID: " + dto.status()));

            produto.setStatus(status);

            repository.save(produto);

            return new ProdutoResponseDTO(produto);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao cadastrar produto: " + e.getMessage(), e);
        }
    }

    public ProdutoListResponseDTO listarProdutosComPaginacao(Pageable pageable) {
        Page<Produto> page = repository.findAll(pageable);
        List<ProdutoListResponseDTO.ProdutoItemDTO> items = page.getContent().stream()
                .map(produto -> {
                    Integer statusId = (produto.getStatus() != null)
                            ? produto.getStatus().getId()
                            : null;

                    return new ProdutoListResponseDTO.ProdutoItemDTO(
                            produto.getNumeroSerie(),
                            produto.getAparelho(),
                            produto.getModelo(),
                            produto.getObservacoes(),
                            statusId,
                            produto.getCor()
                    );
                })
                .toList();

        ProdutoListResponseDTO.PaginacaoMetadataDTO metadata = new ProdutoListResponseDTO.PaginacaoMetadataDTO(
                page.getTotalElements(),
                page.getTotalPages(),
                page.getNumber(),
                page.getSize()
        );

        return new ProdutoListResponseDTO(items, metadata);
    }

    public ProdutoResponseDTO produtoUpdate(Integer id, ProdutoUpdateRequestDTO dto) throws ResponseStatusException {
        try {
            Produto produto = repository.findById(id)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto não encontrado com id: " + id));

            if (dto.numeroSerie() != null) {
                produto.setNumeroSerie(dto.numeroSerie());
            }

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
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Status não encontrado com ID: " + dto.status()));
                produto.setStatus(status);
            }

            Produto produtoAtualizado = repository.save(produto);

            return new ProdutoResponseDTO(produtoAtualizado);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao atualizar produto: " + e.getMessage(), e);
        }
    }

    public List<ProdutoBuscarResponseDTO> buscarProdutos(String query) {
        return repository.findTop50ByAparelhoOrModeloOrNumeroSerieLike(query).stream().map(ProdutoBuscarResponseDTO::new).toList();
    }

    public List<ProdutoStatusDTO> listarProdutoStatus() {
        return statusProdutoRepository.findAll()
                .stream()
                .map(status -> new ProdutoStatusDTO(status.getId(), status.getNome()))
                .toList();
    }
}
