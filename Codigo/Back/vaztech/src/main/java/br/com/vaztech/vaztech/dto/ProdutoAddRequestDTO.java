package br.com.vaztech.vaztech.dto;

public record ProdutoAddRequestDTO (
        String numeroSerie,
        String aparelho,
        String modelo,
        String cor,
        String observacoes,
        Integer status
) {}
