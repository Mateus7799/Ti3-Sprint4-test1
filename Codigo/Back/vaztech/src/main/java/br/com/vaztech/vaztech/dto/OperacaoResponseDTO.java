package br.com.vaztech.vaztech.dto;

import br.com.vaztech.vaztech.entity.Operacao;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record OperacaoResponseDTO (
        Integer id,
        String numeroSerieProduto,
        BigDecimal valor,
        Integer idPessoa,
        Integer idFuncionario,
        Integer tipo,
        String observacoes,

        @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss")
        LocalDateTime dataHoraTransacao
) {
    public OperacaoResponseDTO(Operacao operacao) {
        this(
                operacao.getId(),
                operacao.getProduto().getNumeroSerie(),
                operacao.getValor(),
                operacao.getPessoa().getId(),
                operacao.getFuncionario().getId(),
                operacao.getTipo(),
                operacao.getObservacoes(),
                operacao.getDataHoraTransacao()
        );
    }
}
