package br.com.vaztech.vaztech.service;

import br.com.vaztech.vaztech.dto.PessoaAddRequestDTO;
import br.com.vaztech.vaztech.dto.PessoaResponseDTO;
import br.com.vaztech.vaztech.dto.PessoaUpdateRequestDTO;

public interface PessoaService {
    PessoaResponseDTO criarPessoa(PessoaAddRequestDTO dto);
    PessoaResponseDTO atualizarPessoa(Integer id, PessoaUpdateRequestDTO dto);
}