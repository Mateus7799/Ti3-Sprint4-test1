package br.com.vaztech.vaztech.dto;

import java.util.List;

public record ProdutoResponseDTO(
        List<ProdutoItemDTO> items,
        PaginacaoMetadataDTO metadata
) {

    public record ProdutoItemDTO(
            String numeroSerie,
            String aparelho,
            String modelo,
            String observacoes,
            Integer status,
            String cor
    ) {}


    public record PaginacaoMetadataDTO(
            long totalItems,
            int totalPages,
            int currentPage,
            int pageSize
    ) {}
}