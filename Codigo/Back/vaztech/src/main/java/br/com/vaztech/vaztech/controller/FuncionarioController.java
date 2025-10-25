package br.com.vaztech.vaztech.controller;

import br.com.vaztech.vaztech.dto.FuncionarioAddRequestDTO;
import br.com.vaztech.vaztech.dto.FuncionarioCardResponseDTO;
import br.com.vaztech.vaztech.dto.FuncionarioResponseDTO;
import br.com.vaztech.vaztech.entity.Usuario;
import br.com.vaztech.vaztech.repository.FuncionarioRepository;
import br.com.vaztech.vaztech.service.FuncionarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/funcionarios")
@RequiredArgsConstructor
public class FuncionarioController {

    private final FuncionarioService funcionarioService;
    private final FuncionarioRepository funcionarioRepository;

    private static final Integer ADMIN_ID = 1; //

    @GetMapping("/cards")
    public ResponseEntity<List<FuncionarioCardResponseDTO>> listarCardsFuncionarios() {
        List<FuncionarioCardResponseDTO> response = funcionarioService.listarCardsFuncionariosAtivos();
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<?> criarFuncionario(@Valid @RequestBody FuncionarioAddRequestDTO dto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Usuario usuarioLogado = (Usuario) authentication.getPrincipal();

        if (!usuarioLogado.getId().equals(ADMIN_ID)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("erro", "Acesso negado. Esta operação é restrita a administradores."));
        }

        if (funcionarioRepository.existsByCodFuncionario(dto.codFuncionario())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("erro", "Código de funcionário já cadastrado."));
        }

        FuncionarioResponseDTO response = funcionarioService.criarFuncionario(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public Map<String, String> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        if (ex.getMessage() != null && ex.getMessage().contains("cpf_cnpj")) {
            return Map.of("erro", "O CPF/CNPJ fornecido já está cadastrado.");
        }
        return Map.of("erro", "Violação de dados. Um campo único (como código ou CPF/CNPJ) já existe.");
    }
}