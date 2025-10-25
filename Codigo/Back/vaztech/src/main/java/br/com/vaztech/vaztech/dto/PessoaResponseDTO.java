package br.com.vaztech.vaztech.dto;

import br.com.vaztech.vaztech.entity.Pessoa;
import java.time.LocalDate;

public record PessoaResponseDTO(
        Integer id,
        String nome,
        String cpfCnpj,
        LocalDate dataNascimento,
        String origem
) {

    public PessoaResponseDTO(Pessoa pessoa) {
        this(
                pessoa.getId(),
                pessoa.getNome(),
                pessoa.getCpfCnpj(),
                pessoa.getDataNascimento(),
                pessoa.getOrigem()
        );
    }
}