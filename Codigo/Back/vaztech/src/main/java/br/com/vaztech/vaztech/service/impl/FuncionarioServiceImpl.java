package br.com.vaztech.vaztech.service.impl;

import br.com.vaztech.vaztech.dto.FuncionarioAddRequestDTO;
import br.com.vaztech.vaztech.dto.FuncionarioCardResponseDTO;
import br.com.vaztech.vaztech.dto.FuncionarioResponseDTO;
import br.com.vaztech.vaztech.entity.Funcionario;
import br.com.vaztech.vaztech.repository.FuncionarioRepository;
import br.com.vaztech.vaztech.service.FuncionarioService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FuncionarioServiceImpl implements FuncionarioService {

    private final FuncionarioRepository funcionarioRepository;

    private static final Integer STATUS_ATIVO = 1;

    @Override
    public List<FuncionarioCardResponseDTO> listarCardsFuncionariosAtivos() { //

        List<Funcionario> funcionarios = funcionarioRepository.findAllByStatusOrderByNomeAsc(STATUS_ATIVO);

        return funcionarios.stream()
                .map(this::toCardDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public FuncionarioResponseDTO criarFuncionario(FuncionarioAddRequestDTO dto) {
        Funcionario novoFuncionario = new Funcionario();
        novoFuncionario.setCodFuncionario(dto.codFuncionario());
        novoFuncionario.setNome(dto.nome());
        novoFuncionario.setCpfCnpj(dto.cpfCnpj());
        novoFuncionario.setDataNascimento(dto.dataNascimento());
        novoFuncionario.setStatus(STATUS_ATIVO);

        Funcionario funcionarioSalvo = funcionarioRepository.save(novoFuncionario);
        return new FuncionarioResponseDTO(funcionarioSalvo);
    }

    private FuncionarioCardResponseDTO toCardDTO(Funcionario funcionario) {
        return new FuncionarioCardResponseDTO(
                funcionario.getId(),
                funcionario.getNome(),
                funcionario.getDataNascimento(),
                funcionario.getStatus(),
                funcionario.getCpfCnpj()
        );
    }
}