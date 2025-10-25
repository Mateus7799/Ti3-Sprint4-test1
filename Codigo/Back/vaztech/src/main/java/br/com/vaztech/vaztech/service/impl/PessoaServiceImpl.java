package br.com.vaztech.vaztech.service.impl;

import br.com.vaztech.vaztech.dto.PessoaAddRequestDTO;
import br.com.vaztech.vaztech.dto.PessoaResponseDTO;
import br.com.vaztech.vaztech.dto.PessoaUpdateRequestDTO;
import br.com.vaztech.vaztech.entity.Pessoa;
import br.com.vaztech.vaztech.repository.PessoaRepository;
import br.com.vaztech.vaztech.service.PessoaService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PessoaServiceImpl implements PessoaService {

    private final PessoaRepository pessoaRepository; //

    @Override
    @Transactional
    public PessoaResponseDTO criarPessoa(PessoaAddRequestDTO dto) {
        Pessoa novaPessoa = new Pessoa();
        novaPessoa.setNome(dto.nome());
        novaPessoa.setCpfCnpj(dto.cpfCnpj());
        novaPessoa.setDataNascimento(dto.dataNascimento());
        novaPessoa.setOrigem(dto.origem());
        //
        Pessoa pessoaSalva = pessoaRepository.save(novaPessoa);

        return new PessoaResponseDTO(pessoaSalva);
    }

    @Override
    @Transactional
    public PessoaResponseDTO atualizarPessoa(Integer id, PessoaUpdateRequestDTO dto) {
        Pessoa pessoa = pessoaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Pessoa não encontrada com ID: " + id));

        if (dto.nome() != null) {
            pessoa.setNome(dto.nome());
        }
        if (dto.cpfCnpj() != null) {
            // Validação de unicidade do CPF/CNPJ será tratada pelo banco de dados? Ou add aq Renato
            pessoa.setCpfCnpj(dto.cpfCnpj());
        }
        if (dto.dataNascimento() != null) {
            pessoa.setDataNascimento(dto.dataNascimento());
        }
        if (dto.origem() != null) {
            pessoa.setOrigem(dto.origem());
        }
        //
        Pessoa pessoaAtualizada = pessoaRepository.save(pessoa);

        return new PessoaResponseDTO(pessoaAtualizada);
    }
}