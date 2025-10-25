package br.com.vaztech.vaztech.dto;

import java.time.LocalDate;

public record FuncionarioCardResponseDTO(

        Integer id,
        String nome,
        LocalDate dataNascimento,
        Integer status,
        String cpfCnpj
) {}