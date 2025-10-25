package br.com.vaztech.vaztech.dto;

public record ProdutoUpdateRequestDTO(
        String aparelho,
        String modelo,
        String cor,
        String observacoes,
        Integer status
) {}
